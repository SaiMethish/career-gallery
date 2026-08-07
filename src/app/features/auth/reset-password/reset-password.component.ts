import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { resetPassword } from '../../../core/auth/auth.actions';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'})
export class ResetPasswordComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);

  readonly resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.resetForm.invalid) return;
    this.isSubmitting.set(true);
    const { email, newPassword } = this.resetForm.getRawValue();
    this.store.dispatch(resetPassword({ email, newPassword }));
    
    // Simulate stopping the spinner after 2 seconds (usually handled by effects, but here we just toggle it off if error)
    setTimeout(() => this.isSubmitting.set(false), 2000);
  }
}
