/** Roles supported by the application — mirrors backend Role enum */
export enum Role {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN',
}

/** Auth provider — mirrors backend AuthProvider enum */
export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

/** Shape returned by /auth/login, /auth/register, /auth/refresh */
export interface AuthResponse {
  userId: string;
  email: string;
  role: Role;
  authProvider: AuthProvider;
  accessToken: string;
}

/** In-store representation of the authenticated user */
export interface CurrentUser {
  userId: string;
  email: string;
  role: Role;
  authProvider: AuthProvider;
}
