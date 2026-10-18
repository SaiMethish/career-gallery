import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { JobRequestDTO } from '../../../core/models/job.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.css'
})
export class PostJobComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recruiterService = inject(RecruiterService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  jobForm!: FormGroup;
  isEditMode = false;
  jobId: string | null = null;
  isSubmitting = false;
  error: string | null = null;
  currentSection = 1;
  companyName = 'Carbon Enterprise'; // In a real app, this would come from the user's profile

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', Validators.maxLength(255)],
      jobType: ['', Validators.required],
      experienceMin: [0, Validators.min(0)],
      experienceMax: [null, Validators.min(0)],
      salaryMin: [null, Validators.min(0)],
      salaryMax: [null, Validators.min(0)],
      skills: [''],
      description: ['', [Validators.required, Validators.maxLength(5000)]]
    });

    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');
      if (this.jobId) {
        this.isEditMode = true;
        this.loadJob(this.jobId);
      }
    });
  }

  private loadJob(jobId: string): void {
    this.recruiterService.getMyJobs().subscribe({
      next: (jobs) => {
        const job = jobs.find((item) => item.id === jobId);
        if (!job) {
          this.error = 'This job posting could not be found.';
          return;
        }
        this.companyName = job.companyName;
        this.jobForm.patchValue({
          title: job.title,
          location: job.location,
          jobType: job.jobType,
          experienceMin: job.experienceMin,
          experienceMax: job.experienceMax,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          skills: job.skills,
          description: job.description,
        });
      },
      error: () => (this.error = 'Unable to load this job posting. Please try again.'),
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.jobForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  scrollTo(sectionId: string): void {
    if (sectionId === 'basic') this.currentSection = 1;
    if (sectionId === 'requirements') this.currentSection = 2;
    if (sectionId === 'description') this.currentSection = 3;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const dto: JobRequestDTO = this.jobForm.value;

    if (this.isEditMode && this.jobId) {
      this.recruiterService.updateJob(this.jobId, dto)
        .pipe(
          catchError(err => {
            this.error = err.error?.message || 'Failed to update job posting. Please try again.';
            return of(null);
          }),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe(res => {
          if (res) {
            this.router.navigate(['/recruiter/jobs']);
          }
        });
    } else {
      this.recruiterService.createJob(dto)
        .pipe(
          catchError(err => {
            this.error = err.error?.message || 'Failed to create job posting. Please try again.';
            return of(null);
          }),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe(res => {
          if (res) {
            this.router.navigate(['/recruiter/jobs']);
          }
        });
    }
  }
}
