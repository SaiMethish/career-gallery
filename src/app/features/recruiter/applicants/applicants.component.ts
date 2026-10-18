import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ApplicantResponseDTO, JobApplicationStatus } from '../../../core/models/application.model';
import { JobResponseDTO } from '../../../core/models/job.model';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css'})
export class ApplicantsComponent implements OnInit {
  private readonly recruiter = inject(RecruiterService);
  private readonly route = inject(ActivatedRoute);
  readonly applicants = signal<ApplicantResponseDTO[]>([]);
  readonly job = signal<JobResponseDTO | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly statuses = Object.values(JobApplicationStatus);

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    if (!jobId) { this.error.set('Job not found.'); this.loading.set(false); return; }
    this.recruiter.getMyJobs().subscribe({
      next: (jobs) => this.job.set(jobs.find((item) => item.id === jobId)),
      error: () => this.error.set('Unable to load the job posting.'),
    });
    this.recruiter.getJobApplicants(jobId).subscribe({
      next: (page) => { this.applicants.set(page.content); this.loading.set(false); },
      error: () => { this.error.set('Unable to load applicants.'); this.loading.set(false); },
    });
  }

  updateStatus(applicant: ApplicantResponseDTO, status: string): void {
    const nextStatus = status as JobApplicationStatus;
    this.recruiter.updateApplicationStatus(applicant.id, nextStatus).subscribe({
      next: (updated) => this.applicants.update((items) => items.map((item) => item.id === updated.id ? updated : item)),
      error: () => this.error.set('Unable to update this application status.'),
    });
  }
}
