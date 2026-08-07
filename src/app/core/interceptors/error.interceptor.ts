import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, switchMap, take, throwError, EMPTY, BehaviorSubject, filter } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../services/toast.service';
import * as AuthActions from '../auth/auth.actions';
import { selectIsRefreshing, selectAccessToken } from '../auth/auth.selectors';
import { APP_ROUTES } from '../constants/routes.constants';
import { environment } from '../../../environments/environment';

// Token refresh queuing — prevents concurrent refresh calls
let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

/**
 * Error interceptor that:
 * - 401: attempts silent refresh → retries original request → logs out if refresh fails
 * - 403: redirects to /not-authorized
 * - 5xx: shows a generic error toast
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!req.url.startsWith(environment.apiUrl)) return throwError(() => error);

      if (error.status === 401 && !req.url.includes('/auth/')) {
        return handle401(req, next, store, authService, router);
      }

      if (error.status === 403) {
        router.navigate([APP_ROUTES.NOT_AUTHORIZED]);
        return EMPTY;
      }

      if (error.status >= 500) {
        toast.error('Server Error', 'Something went wrong. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: Store,
  authService: AuthService,
  router: Router
) {
  if (isRefreshing) {
    // Queue behind the in-flight refresh
    return refreshSubject.pipe(
      filter((t): t is string => t !== null),
      take(1),
      switchMap((newToken) =>
        next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
      )
    );
  }

  isRefreshing = true;
  refreshSubject.next(null);

  return authService.refresh().pipe(
    switchMap((response) => {
      isRefreshing = false;
      refreshSubject.next(response.accessToken);
      store.dispatch(AuthActions.refreshTokenSuccess({ response }));
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` } }));
    }),
    catchError((refreshErr) => {
      isRefreshing = false;
      store.dispatch(AuthActions.logout());
      router.navigate([APP_ROUTES.AUTH.LOGIN]);
      return throwError(() => refreshErr);
    })
  );
}
