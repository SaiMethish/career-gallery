import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs';
import { selectAccessToken } from '../auth/auth.selectors';
import { environment } from '../../../environments/environment';

/**
 * Functional HTTP interceptor that attaches the JWT Bearer token
 * to all requests going to the backend API.
 * Skips the refresh endpoint to prevent circular dependency.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Only intercept requests to our own API
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  // Do not attach token to the refresh endpoint (uses httpOnly cookie)
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return store.select(selectAccessToken).pipe(
    take(1),
    switchMap((token) => {
      if (!token) return next(req);
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    })
  );
};
