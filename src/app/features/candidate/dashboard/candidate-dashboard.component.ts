import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CandidateService } from '../../../core/services/candidate.service';
import { JobService } from '../../../core/services/job.service';
import { selectCurrentUser } from '../../../core/auth/auth.selectors';
import { CandidateProfileResponseDTO } from '../../../core/models/candidate.model';
import { ApplicationResponseDTO } from '../../../core/models/application.model';
import { JobResponseDTO } from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';
import { AsyncPipe, DatePipe } from '@angular/common';

/** Candidate dashboard — matches Stitch "Dashboard - Candidate Console" */
@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterLink, JobCardComponent, StatusBadgeComponent, EmptyStateComponent, DatePipe,AsyncPipe],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css'})
export class CandidateDashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly candidateService = inject(CandidateService);
  private readonly jobService = inject(JobService);
  private readonly toast = inject(ToastService);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly profile = signal<CandidateProfileResponseDTO | null>(null);
  readonly applications = signal<ApplicationResponseDTO[]>([]);
  readonly savedJobs = signal<JobResponseDTO[]>([]);
  readonly recentJobs = signal<JobResponseDTO[]>([]);
  readonly isLoadingApps = signal(true);
  readonly isLoadingJobs = signal(true);

  ngOnInit(): void {
    this.loadProfile();
    this.loadApplications();
    this.loadSavedJobs();
    this.loadRecentJobs();
  }

  activeApplications(): number {
    return this.applications().filter(
      (a) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(a.status)
    ).length;
  }

  profileStrength(): number {
    const p = this.profile();
    if (!p) return 0;
    let score = 0;
    if (p.fullName) score += 25;
    if (p.phone) score += 25;
    if (p.skills?.length > 0) score += 25;
    if (p.resumeUrl) score += 25;
    return score;
  }

  onSaveJob(jobId: string): void {
    this.candidateService.saveJob(jobId).subscribe({
      next: () => this.toast.success('Saved', 'Job added to your saved list.'),
      error: () => this.toast.error('Error', 'Failed to save job.'),
    });
  }

  private loadProfile(): void {
    this.candidateService.getProfile().subscribe({
      next: (p) => this.profile.set(p),
    });
  }

  private loadApplications(): void {
    this.candidateService.getMyApplications(0, 5).subscribe({
      next: (page) => {
        this.applications.set(page.content);
        this.isLoadingApps.set(false);
      },
      error: () => this.isLoadingApps.set(false),
    });
  }

  private loadSavedJobs(): void {
    this.candidateService.getSavedJobs().subscribe({
      next: (jobs) => this.savedJobs.set(jobs),
    });
  }

  private loadRecentJobs(): void {
    this.jobService.searchJobs({}, 0, 4).subscribe({
      next: (page) => {
        this.recentJobs.set(page.content);
        this.isLoadingJobs.set(false);
      },
      error: () => this.isLoadingJobs.set(false),
    });
  }
}
