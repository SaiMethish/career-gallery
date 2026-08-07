import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import { CurrentUser } from '../models/auth.model';
import * as AuthActions from './auth.actions';

function toCurrentUser(response: {
  userId: string;
  email: string;
  role: import('../models/auth.model').Role;
  authProvider: import('../models/auth.model').AuthProvider;
}): CurrentUser {
  return {
    userId: response.userId,
    email: response.email,
    role: response.role,
    authProvider: response.authProvider,
  };
}

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state): AuthState => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { response }): AuthState => ({
    ...state,
    isLoading: false,
    currentUser: toCurrentUser(response),
    accessToken: response.accessToken,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Register
  on(AuthActions.register, (state): AuthState => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.registerSuccess, (state, { response }): AuthState => ({
    ...state,
    isLoading: false,
    currentUser: toCurrentUser(response),
    accessToken: response.accessToken,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Refresh Token
  on(AuthActions.refreshToken, (state): AuthState => ({ ...state, isRefreshing: true })),
  on(AuthActions.refreshTokenSuccess, (state, { response }): AuthState => ({
    ...state,
    isRefreshing: false,
    sessionRestored: true,
    currentUser: toCurrentUser(response),
    accessToken: response.accessToken,
  })),
  on(AuthActions.refreshTokenFailure, (state): AuthState => ({
    ...state,
    isRefreshing: false,
    sessionRestored: true,
    currentUser: null,
    accessToken: null,
  })),

  // Logout
  on(AuthActions.logout, (): AuthState => ({
    ...initialAuthState,
    sessionRestored: true,
  })),

  // OAuth Callback — token is available from the URL param
  on(AuthActions.oauthCallback, (state, { accessToken }): AuthState => ({
    ...state,
    accessToken,
  }))
);
