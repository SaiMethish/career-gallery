import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CompanyService } from '../../../core/services/company.service';
import { CompanyDetailDTO } from '../../../core/models/recruiter.model';
import { JobResponseDTO } from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';

/** Candidate public view of a company profile with open job listings */
@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, JobCardComponent, EmptyStateComponent],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.css',
})
export class CompanyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly companyService = inject(CompanyService);
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);

  readonly company = signal<CompanyDetailDTO | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly savedJobIds = signal<Set<string>>(new Set<string>());
  readonly appliedJobIds = signal<Set<string>>(new Set<string>());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompany(id);
      this.loadSavedJobs();
      this.loadAppliedJobs();
    } else {
      this.error.set('Company ID not provided');
      this.loading.set(false);
    }
  }

  loadCompany(id: string): void {
    this.loading.set(true);
    this.companyService.getCompanyById(id).subscribe({
      next: (data) => {
        this.company.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load company profile.');
        this.loading.set(false);
      },
    });
  }

  loadSavedJobs(): void {
    this.candidateService.getSavedJobs().subscribe({
      next: (jobs: JobResponseDTO[]) => {
        const ids = new Set(jobs.map((j) => j.id));
        this.savedJobIds.set(ids);
      },
      error: () => {},
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

  get initials(): string {
    const name = this.company()?.companyName || 'CO';
    return name.slice(0, 2).toUpperCase();
  }

  isSaved(jobId: string): boolean {
    return this.savedJobIds().has(jobId);
  }

  isApplied(jobId: string): boolean {
    return this.appliedJobIds().has(jobId);
  }

  onSaveToggle(jobId: string): void {
    if (this.isSaved(jobId)) {
      this.candidateService.unsaveJob(jobId).subscribe({
        next: () => {
          this.savedJobIds.update((set) => {
            const next = new Set(set);
            next.delete(jobId);
            return next;
          });
          this.toast.info('Removed', 'Job removed from saved list.');
        },
      });
    } else {
      this.candidateService.saveJob(jobId).subscribe({
        next: () => {
          this.savedJobIds.update((set) => {
            const next = new Set(set);
            next.add(jobId);
            return next;
          });
          this.toast.success('Saved', 'Job bookmarked to your saved list.');
        },
      });
    }
  }

  onApply(jobId: string): void {
    this.candidateService.applyToJob(jobId, {}).subscribe({
      next: () => {
        this.appliedJobIds.update((set) => {
          const next = new Set(set);
          next.add(jobId);
          return next;
        });
        this.toast.success('Application Sent', 'Your application has been submitted successfully.');
      },
      error: (err: { error?: { message?: string } }) => {
        const msg = err?.error?.message || 'Failed to submit application.';
        this.toast.error('Application Failed', msg);
      },
    });
  }
}
