import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs';
import { selectUserRole } from '../auth/auth.selectors';
import { Role } from '../models/auth.model';
import { APP_ROUTES } from '../constants/routes.constants';

/**
 * Functional guard that enforces role-based access.
 * Reads required roles from route.data['roles'] (array of Role).
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);
  const requiredRoles: Role[] = route.data['roles'] ?? [];

  return store.select(selectUserRole).pipe(
    take(1),
    map((role) => {
      if (role && requiredRoles.includes(role)) return true;
      return router.createUrlTree([APP_ROUTES.NOT_AUTHORIZED]);
    })
  );
};
