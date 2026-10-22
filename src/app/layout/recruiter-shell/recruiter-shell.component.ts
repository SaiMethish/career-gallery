import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { selectCurrentUser } from '../../core/auth/auth.selectors';
import * as AuthActions from '../../core/auth/auth.actions';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

/**
 * Shell layout for authenticated recruiter users.
 * Fixed dark sidebar + top header + main content area.
 */
@Component({
  selector: 'app-recruiter-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NotificationBellComponent, FooterComponent],
  templateUrl: './recruiter-shell.component.html',
  styleUrl: './recruiter-shell.component.css',
})
export class RecruiterShellComponent {
  private readonly store = inject(Store);
  readonly currentUser$ = this.store.select(selectCurrentUser);

  readonly userInitial$ = this.currentUser$.pipe(
    map((u) => (u?.email ?? '').charAt(0).toUpperCase())
  );

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
