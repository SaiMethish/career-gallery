import { Component, inject, OnInit, signal } from '@angular/core';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponseDTO } from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

/** Saved jobs list — matches Stitch "Saved Jobs" screen */
@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [JobCardComponent, EmptyStateComponent],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css'})
export class SavedJobsComponent implements OnInit {
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);

  readonly jobs = signal<JobResponseDTO[]>([]);
  readonly appliedJobIds = signal<Set<string>>(new Set<string>());
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadSavedJobs();
    this.loadAppliedJobs();
  }

  loadSavedJobs(): void {
    this.candidateService.getSavedJobs().subscribe({
      next: (j) => { this.jobs.set(j); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  loadAppliedJobs(): void {
    this.candidateService.getMyApplications(0, 100).subscribe({
      next: (page) => {
        const ids = new Set((page.content || []).map((app) => app.jobId));
        this.appliedJobIds.set(ids);
      },
      error: () => {},
    });
  }

  isApplied(jobId: string): boolean {
    return this.appliedJobIds().has(jobId);
  }

  onUnsave(jobId: string): void {
    this.candidateService.unsaveJob(jobId).subscribe({
      next: () => {
        this.jobs.update((list) => list.filter((j) => j.id !== jobId));
        this.toast.success('Removed', 'Job removed from saved list.');
      },
      error: () => this.toast.error('Error', 'Failed to unsave job.'),
    });
  }

  onApply(jobId: string): void {
    if (this.isApplied(jobId)) return;

    this.candidateService.applyToJob(jobId, {}).subscribe({
      next: () => {
        this.toast.success('Applied!', 'Your application was submitted.');
        this.appliedJobIds.update((set) => new Set([...set, jobId]));
      },
      error: () => this.toast.error('Error', 'Failed to apply.'),
    });
  }
}
