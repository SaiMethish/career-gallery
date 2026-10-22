import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import * as AuthActions from '../../../core/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../../core/auth/auth.selectors';

/** Login page — matches Stitch "Login - JobOrbit" screen */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'})
export class LoginComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectAuthError);

  form!: FormGroup;
  private returnUrl: string | null = null;

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    
    // Check if we were redirected back here from a failed OAuth login
    const errorParam = this.route.snapshot.queryParamMap.get('error');
    if (errorParam === 'account_not_found') {
      this.store.dispatch(AuthActions.loginFailure({ 
        error: { message: 'Account not found. Please create an account first.', status: 401, timestamp: new Date().toISOString() } 
      }));
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value as { email: string; password: string };
    const returnUrl = this.returnUrl ?? undefined;
    this.store.dispatch(AuthActions.login({ email, password, returnUrl }));
  }
}
