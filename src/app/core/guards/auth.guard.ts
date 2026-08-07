import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, switchMap, take, map } from 'rxjs';
import { selectIsLoggedIn, selectSessionRestored } from '../auth/auth.selectors';
import { APP_ROUTES } from '../constants/routes.constants';

/**
 * Functional guard that blocks access to authenticated-only routes.
 * Waits for the session restore to complete before evaluating the guard,
 * so a page refresh doesn't flash the login screen.
 */
export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectSessionRestored).pipe(
    filter((restored) => restored),
    take(1),
    switchMap(() =>
      store.select(selectIsLoggedIn).pipe(
        take(1),
        map((isLoggedIn) => {
          if (isLoggedIn) return true;
          return router.createUrlTree([APP_ROUTES.AUTH.LOGIN], {
            queryParams: { returnUrl: state.url },
          });
        })
      )
    )
  );
};
