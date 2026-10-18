import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecruiterService } from '../../../core/services/recruiter.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'})
export class CompanyProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recruiter = inject(RecruiterService);
  readonly saving = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.maxLength(255)]],
    companyWebsite: ['', Validators.maxLength(255)],
    industry: ['', Validators.maxLength(100)],
    location: ['', Validators.maxLength(255)],
    companyDescription: ['', Validators.maxLength(2000)],
  });

  ngOnInit(): void {
    this.recruiter.getProfile().subscribe({
      next: (profile) => this.form.patchValue(profile),
      error: () => this.error.set('Unable to load your company profile.'),
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true); this.message.set(null); this.error.set(null);
    this.recruiter.updateProfile(this.form.getRawValue()).subscribe({
      next: () => { this.saving.set(false); this.message.set('Company profile saved.'); },
      error: () => { this.saving.set(false); this.error.set('Unable to save your company profile.'); },
    });
  }
}
