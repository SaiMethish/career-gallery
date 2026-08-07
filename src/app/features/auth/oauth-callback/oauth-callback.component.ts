import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../core/auth/auth.actions';

/**
 * OAuth callback handler — reads the access token from the ?access= query param
 * that the backend redirects to after Google OAuth success.
 */
@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css'})
export class OAuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const accessToken = this.route.snapshot.queryParamMap.get('access');
    if (accessToken) {
      this.store.dispatch(AuthActions.oauthCallback({ accessToken }));
      // Navigate to dashboard; effects will handle role-based redirect on next login
      this.router.navigate(['/candidate/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
