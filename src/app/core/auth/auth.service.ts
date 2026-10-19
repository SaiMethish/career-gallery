import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth.model';

/** Low-level HTTP calls for the auth resource. Components never call HttpClient directly. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/auth`;

  /** POST /auth/login — sets httpOnly refresh_token cookie on the backend */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.base}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  /** POST /auth/register */
  register(email: string, password: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.base}/register`,
      { email, password, role },
      { withCredentials: true }
    );
  }

  /**
   * POST /auth/refresh — sends the httpOnly cookie automatically.
   * Returns new access token. Does NOT need Authorization header.
   */
  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/refresh`, {}, { withCredentials: true });
  }

  /** POST /auth/logout — clears the refresh_token cookie on the backend */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/logout`, {}, { withCredentials: true });
  }

  /** POST /auth/reset-password — resets user password directly */
  resetPassword(email: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.base}/reset-password`, { email, newPassword });
  }

  /** POST /auth/change-password — changes authenticated user password */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.base}/change-password`, { currentPassword, newPassword });
  }
}
