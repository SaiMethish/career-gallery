import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import * as AuthActions from './auth.actions';
import { ApiError } from '../models/api-error.model';
import { Role } from '../models/auth.model';
import { APP_ROUTES } from '../constants/routes.constants';
import { ToastService } from '../services/toast.service';

/** NgRx Effects for all authentication flows */
@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  /** Login flow: call API → dispatch success/failure */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password, returnUrl }) =>
        this.authService.login(email, password).pipe(
          map((response) => AuthActions.loginSuccess({ response, returnUrl })),
          catchError((err) =>
            of(AuthActions.loginFailure({ error: this.extractError(err) }))
          )
        )
      )
    )
  );

  /** On login success, navigate to role dashboard or returnUrl */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response, returnUrl }) => {
          const destination = returnUrl ?? this.getDashboardRoute(response.role);
          this.router.navigateByUrl(destination);
        })
      ),
    { dispatch: false }
  );

  /** Register flow */
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ email, password, role }) =>
        this.authService.register(email, password, role).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((err) =>
            of(AuthActions.registerFailure({ error: this.extractError(err) }))
          )
        )
      )
    )
  );

  /** On register success, navigate to role dashboard */
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ response }) => {
          this.toast.success('Welcome!', 'Your account has been created.');
          this.router.navigateByUrl(this.getDashboardRoute(response.role));
        })
      ),
    { dispatch: false }
  );

  /** Silent refresh on app startup — called by the app initializer */
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.authService.refresh().pipe(
          map((response) => AuthActions.refreshTokenSuccess({ response })),
          catchError(() => of(AuthActions.refreshTokenFailure()))
        )
      )
    )
  );

  /** On logout: call backend to clear cookie, then navigate to login */
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        switchMap(() =>
          this.authService.logout().pipe(
            catchError(() => of(null)), // Ignore errors on logout
            tap(() => this.router.navigateByUrl(APP_ROUTES.AUTH.LOGIN))
          )
        )
      ),
    { dispatch: false }
  );

  /** Reset Password flow */
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      switchMap(({ email, newPassword }) =>
        this.authService.resetPassword(email, newPassword).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError((err) => of(AuthActions.resetPasswordFailure({ error: this.extractError(err) })))
        )
      )
    )
  );

  /** On reset success, navigate to login */
  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => {
          this.toast.success('Password Reset', 'Your password has been successfully updated.');
          this.router.navigateByUrl(APP_ROUTES.AUTH.LOGIN);
        })
      ),
    { dispatch: false }
  );

  /** Determine role-specific dashboard route */
  private getDashboardRoute(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return APP_ROUTES.ADMIN.DASHBOARD;
      case Role.RECRUITER:
        return `/${APP_ROUTES.RECRUITER.DASHBOARD}`;
      case Role.CANDIDATE:
      default:
        return `/${APP_ROUTES.CANDIDATE.DASHBOARD}`;
    }
  }

  /** Normalize HTTP errors into ApiError shape */
  private extractError(err: { status?: number; error?: { message?: string } }): ApiError {
    return {
      status: err?.status ?? 0,
      message: err?.error?.message ?? 'An unexpected error occurred.',
    };
  }
}
