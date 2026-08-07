import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { firstValueFrom, filter } from 'rxjs';
import { MyPreset } from './theme.preset';
import { routes } from './app.routes';
import { authReducer } from './core/auth/auth.reducer';
import { AuthEffects } from './core/auth/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import * as AuthActions from './core/auth/auth.actions';
import { selectSessionRestored } from './core/auth/auth.selectors';
import { MessageService, ConfirmationService } from 'primeng/api';

/**
 * App initializer that performs a silent token refresh on startup.
 * This restores the session from the httpOnly refresh_token cookie.
 * The app waits for sessionRestored = true before rendering guarded routes.
 */
function initializeAuth(store: Store) {
  return async () => {
    store.dispatch(AuthActions.refreshToken());
    await firstValueFrom(
      store.select(selectSessionRestored).pipe(filter((restored) => restored))
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: { darkModeSelector: false },
      },
    }),
    MessageService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => initializeAuth(store),
      deps: [Store],
      multi: true,
    },
  ],
};
