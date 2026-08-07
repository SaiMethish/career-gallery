import { createAction, props } from '@ngrx/store';
import { AuthResponse, CurrentUser } from '../models/auth.model';
import { ApiError } from '../models/api-error.model';

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string; returnUrl?: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse; returnUrl?: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: ApiError }>()
);

// ── Register ──────────────────────────────────────────────────────────────────
export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string; role: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ response: AuthResponse }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: ApiError }>()
);

// ── Refresh Token ─────────────────────────────────────────────────────────────
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ response: AuthResponse }>()
);

export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure');

export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ email: string; newPassword: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success'
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: ApiError }>()
);

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = createAction('[Auth] Logout');

// ── OAuth Callback ────────────────────────────────────────────────────────────
export const oauthCallback = createAction(
  '[Auth] OAuth Callback',
  props<{ accessToken: string }>()
);
