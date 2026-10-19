import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { selectCurrentUser } from '../../core/auth/auth.selectors';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AsyncPipe, TitleCasePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly currentUser$ = this.store.select(selectCurrentUser);

  readonly emailAlerts = signal(localStorage.getItem('career-email-alerts') !== 'false');
  readonly appUpdates = signal(localStorage.getItem('career-app-updates') !== 'false');
  readonly compactTables = signal(localStorage.getItem('career-compact-tables') === 'true');

  readonly updatingPassword = signal(false);
  readonly passwordError = signal<string | null>(null);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  savePreferences(): void {
    localStorage.setItem('career-email-alerts', String(this.emailAlerts()));
    localStorage.setItem('career-app-updates', String(this.appUpdates()));
    localStorage.setItem('career-compact-tables', String(this.compactTables()));
    this.toast.success('Saved', 'System preferences updated.');
  }

  updatePassword(): void {
    this.passwordError.set(null);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordError.set('New passwords do not match.');
      return;
    }

    this.updatingPassword.set(true);
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.updatingPassword.set(false);
        this.passwordForm.reset();
        this.toast.success('Success', 'Password changed successfully.');
      },
      error: (err) => {
        this.updatingPassword.set(false);
        const msg = err.error?.message || 'Failed to update password. Please check your current password.';
        this.passwordError.set(msg);
        this.toast.error('Error', msg);
      }
    });
  }
}
