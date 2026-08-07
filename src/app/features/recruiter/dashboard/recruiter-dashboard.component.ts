import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponseDTO, JobStatus } from '../../../core/models/job.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

/** Recruiter dashboard — matches Stitch "Recruiter Console" screen */
@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrl: './recruiter-dashboard.component.css'})
export class RecruiterDashboardComponent implements OnInit {
  private readonly recruiterService = inject(RecruiterService);
  private readonly toast = inject(ToastService);

  readonly jobs = signal<JobResponseDTO[]>([]);
  readonly isLoading = signal(true);
  readonly JobStatus = JobStatus;

  readonly totalJobs = () => this.jobs().length;
  readonly openJobs = () => this.jobs().filter((j) => j.status === JobStatus.OPEN).length;
  readonly closedJobs = () => this.jobs().filter((j) => j.status !== JobStatus.OPEN).length;
  readonly totalApplicants = () => this.jobs().reduce((sum, j) => sum + j.applicationCount, 0);

  ngOnInit(): void {
    this.recruiterService.getMyJobs().subscribe({
      next: (j) => { this.jobs.set(j); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  closeJob(jobId: string): void {
    this.recruiterService.closeJob(jobId).subscribe({
      next: (updated) => {
        this.jobs.update((list) => list.map((j) => (j.id === jobId ? updated : j)));
        this.toast.success('Closed', 'Job has been closed.');
      },
      error: () => this.toast.error('Error', 'Failed to close job.'),
    });
  }
}
