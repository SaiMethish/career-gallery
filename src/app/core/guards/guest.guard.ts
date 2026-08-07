import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, switchMap, take, map } from 'rxjs';
import { selectIsLoggedIn, selectSessionRestored, selectUserRole } from '../auth/auth.selectors';
import { Role } from '../models/auth.model';
import { APP_ROUTES } from '../constants/routes.constants';

/**
 * Functional guard that blocks auth pages (/auth/login, /auth/register)
 * from authenticated users and redirects them to their role dashboard.
 */
export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectSessionRestored).pipe(
    filter((restored) => restored),
    take(1),
    switchMap(() =>
      store.select(selectIsLoggedIn).pipe(
        take(1),
        switchMap((isLoggedIn) => {
          if (!isLoggedIn) return [true];
          return store.select(selectUserRole).pipe(
            take(1),
            map((role) => {
              const destination =
                role === Role.RECRUITER
                  ? `/${APP_ROUTES.RECRUITER.DASHBOARD}`
                  : `/${APP_ROUTES.CANDIDATE.DASHBOARD}`;
              return router.createUrlTree([destination]);
            })
          );
        })
      )
    )
  );
};
