import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.currentUser !== null && state.accessToken !== null
);

export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role ?? null
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectIsRefreshing = createSelector(
  selectAuthState,
  (state) => state.isRefreshing
);

export const selectSessionRestored = createSelector(
  selectAuthState,
  (state) => state.sessionRestored
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
