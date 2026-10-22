import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import * as AuthActions from '../../../core/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../../core/auth/auth.selectors';
import { Role } from '../../../core/models/auth.model';

/** Register page — matches Stitch "Register - JobOrbit" screen */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe, ButtonModule, InputTextModule, PasswordModule, SelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'})
export class RegisterComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectAuthError);

  form!: FormGroup;

  readonly roleOptions = [
    { value: Role.CANDIDATE, label: 'Candidate', desc: 'Looking for a job', icon: 'pi-user' },
    { value: Role.RECRUITER, label: 'Recruiter', desc: 'Hiring talent', icon: 'pi-building' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [null, Validators.required],
    });
  }

  selectRole(role: Role): void {
    this.form.patchValue({ role });
    this.form.get('role')?.markAsTouched();
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
    const { email, password, role } = this.form.value as { email: string; password: string; role: string };
    this.store.dispatch(AuthActions.register({ email, password, role }));
  }

  /** Sign up via Google using the role already selected in the form */
  continueWithGoogle(): void {
    const role = this.form.get('role')?.value as string;
    if (!role) {
      this.form.get('role')?.markAsTouched();
      return;
    }
    window.location.href = `http://localhost:8080/auth/oauth2/authorize/google?role=${role}`;
  }
}
