import { Component, inject, OnInit, signal, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponseDTO, JobType, JobStatus } from '../../../core/models/job.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

/** Job detail page — matches Stitch "Job Details - Carbon Talent" screen */
@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, EmptyStateComponent,DecimalPipe],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'})
export class JobDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobService = inject(JobService);
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);

  readonly job = signal<JobResponseDTO | null>(null);
  readonly isLoading = signal(true);
  readonly saved = signal(false);
  readonly applied = signal(false);
  readonly applying = signal(false);
  readonly JobStatus = JobStatus;

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) return;

    this.jobService.getJobById(jobId).subscribe({
      next: (j) => {
        this.job.set(j);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    this.candidateService.getSavedJobs().subscribe({
      next: (jobs) => this.saved.set(jobs.some((s) => s.id === jobId)),
    });

    this.candidateService.getMyApplications(0, 100).subscribe({
      next: (page) => this.applied.set((page.content || []).some((a) => a.jobId === jobId)),
    });
  }

  toggleSave(): void {
    const jobId = this.job()!.id;
    if (this.saved()) {
      this.candidateService.unsaveJob(jobId).subscribe({
        next: () => { this.saved.set(false); this.toast.success('Removed', 'Job removed from saved.'); },
      });
    } else {
      this.candidateService.saveJob(jobId).subscribe({
        next: () => { this.saved.set(true); this.toast.success('Saved', 'Job added to saved list.'); },
      });
    }
  }

  apply(): void {
    if (this.applied()) return;
    this.applying.set(true);
    this.candidateService.applyToJob(this.job()!.id, {}).subscribe({
      next: () => {
        this.applying.set(false);
        this.applied.set(true);
        this.toast.success('Applied!', 'Your application was submitted.');
      },
      error: () => { this.applying.set(false); this.toast.error('Error', 'Failed to apply.'); },
    });
  }

  formatJobType(type: JobType): string {
    return { FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract' }[type] ?? type;
  }
}
