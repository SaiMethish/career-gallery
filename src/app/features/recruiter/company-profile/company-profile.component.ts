import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { RecruiterProfileResponseDTO } from '../../../core/models/recruiter.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css',
})
export class CompanyProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recruiter = inject(RecruiterService);
  private readonly toast = inject(ToastService);

  readonly saving = signal(false);
  readonly loading = signal(true);
  readonly profile = signal<RecruiterProfileResponseDTO | null>(null);

  readonly form = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.maxLength(255)]],
    companyWebsite: ['', [Validators.maxLength(255)]],
    industry: ['', [Validators.maxLength(100)]],
    location: ['', [Validators.maxLength(255)]],
    companyDescription: ['', [Validators.maxLength(3000)]],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.recruiter.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.form.patchValue({
          companyName: profile.companyName || '',
          companyWebsite: profile.companyWebsite || '',
          industry: profile.industry || '',
          location: profile.location || '',
          companyDescription: profile.companyDescription || '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Load Error', 'Unable to load company profile.');
      },
    });
  }

  get initials(): string {
    const name = this.form.get('companyName')?.value || this.profile()?.companyName || 'CO';
    return name.slice(0, 2).toUpperCase();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Invalid Form', 'Please complete all required fields.');
      return;
    }

    this.saving.set(true);
    this.recruiter.updateProfile(this.form.getRawValue()).subscribe({
      next: (updated) => {
        this.saving.set(false);
        this.profile.set(updated);
        this.form.markAsPristine();
        this.toast.success('Profile Saved', 'Your company information has been updated successfully.');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Save Failed', 'Unable to save your company profile. Please check your network.');
      },
    });
  }

  reset(): void {
    if (this.profile()) {
      this.form.patchValue(this.profile()!);
      this.form.markAsPristine();
    }
  }
}
