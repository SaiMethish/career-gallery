import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import { CurrentUser, Role, AuthProvider } from '../models/auth.model';
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

function decodeJwt(token: string): CurrentUser | null {
  try {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return {
      userId: payload.userId || '',
      email: payload.sub || payload.email || '',
      role: payload.role || Role.CANDIDATE,
      authProvider: payload.authProvider || AuthProvider.GOOGLE,
    };
  } catch (e) {
    return null;
  }
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
    currentUser: decodeJwt(accessToken),
  }))
);
