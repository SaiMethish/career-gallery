import { Component, inject, OnInit, signal } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { RecommendedJobDTO } from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DecimalPipe } from '@angular/common';

/** AI-recommended jobs page — matches Stitch "AI Recommended Jobs" screen */
@Component({
  selector: 'app-ai-recommendations',
  standalone: true,
  imports: [JobCardComponent, EmptyStateComponent, DecimalPipe],
  templateUrl: './ai-recommendations.component.html',
  styleUrl: './ai-recommendations.component.css'})
export class AiRecommendationsComponent implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);

  readonly recommendations = signal<RecommendedJobDTO[]>([]);
  readonly appliedJobIds = signal<Set<string>>(new Set<string>());
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.jobService.getRecommendations().subscribe({
      next: (recs) => { this.recommendations.set(recs); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });

    this.candidateService.getMyApplications(0, 100).subscribe({
      next: (page) => this.appliedJobIds.set(new Set((page.content || []).map((app) => app.jobId))),
    });
  }

  isApplied(jobId: string): boolean {
    return this.appliedJobIds().has(jobId);
  }

  onSave(jobId: string): void {
    this.candidateService.saveJob(jobId).subscribe({
      next: () => this.toast.success('Saved', 'Job added to saved list.'),
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
