import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { selectCurrentUser } from '../../core/auth/auth.selectors';
import * as AuthActions from '../../core/auth/auth.actions';
import { FooterComponent } from '../../shared/components/footer/footer.component';

/**
 * Shell layout for authenticated platform administrators.
 * Sidebar + top navigation header + role badge + router outlet.
 */
@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, FooterComponent],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.css',
})
export class AdminShellComponent {
  private readonly store = inject(Store);
  readonly currentUser$ = this.store.select(selectCurrentUser);

  readonly userInitial$ = this.currentUser$.pipe(
    map((u) => (u?.email ?? 'A').charAt(0).toUpperCase())
  );

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
