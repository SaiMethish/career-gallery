import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { selectCurrentUser, selectIsLoggedIn } from '../../core/auth/auth.selectors';
import * as AuthActions from '../../core/auth/auth.actions';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

/**
 * Shell layout for authenticated candidate users.
 * Fixed dark sidebar + top header + main content area.
 */
@Component({
  selector: 'app-candidate-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NotificationBellComponent, FooterComponent],
  templateUrl: './candidate-shell.component.html',
  styleUrl: './candidate-shell.component.css',
})
export class CandidateShellComponent {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly pageTitle = signal('Dashboard');

  readonly userInitial$ = this.currentUser$.pipe(
    map((u) => (u?.email ?? '').charAt(0).toUpperCase())
  );

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
