import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobService } from '../../../core/services/job.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { JobResponseDTO, JobSearchFilters, PageResponse, JobType } from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

/** Job search and browse page — matches Stitch "Browse Jobs" + "Search Results" screens */
@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [ReactiveFormsModule, JobCardComponent, EmptyStateComponent, SelectModule, InputTextModule, ButtonModule],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css'})
export class JobSearchComponent implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly jobs = signal<JobResponseDTO[]>([]);
  readonly savedJobIds = signal<Set<string>>(new Set());
  readonly appliedJobIds = signal<Set<string>>(new Set());
  readonly isLoading = signal(true);
  readonly currentPage = signal(0);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  filterForm!: FormGroup;

  readonly jobTypeOptions = [
    { label: 'Full Time', value: JobType.FULL_TIME },
    { label: 'Part Time', value: JobType.PART_TIME },
    { label: 'Contract', value: JobType.CONTRACT },
  ];

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      location: [''],
      skills: [''],
      jobType: [null],
      experienceMin: [null],
      experienceMax: [null],
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadJobs();
      });

    this.loadJobs();
    this.loadSavedJobIds();
    this.loadAppliedJobIds();
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
          const updated = new Set(this.savedJobIds());
          updated.delete(jobId);
          this.savedJobIds.set(updated);
          this.toast.success('Removed', 'Job removed from saved list.');
        },
      });
    } else {
      this.candidateService.saveJob(jobId).subscribe({
        next: () => {
          const updated = new Set(this.savedJobIds());
          updated.add(jobId);
          this.savedJobIds.set(updated);
          this.toast.success('Saved', 'Job added to your saved list.');
        },
      });
    }
  }

  onApply(jobId: string): void {
    if (this.isApplied(jobId)) return;

    this.candidateService.applyToJob(jobId, {}).subscribe({
      next: () => {
        this.toast.success('Applied!', 'Your application was submitted.');
        this.appliedJobIds.update((set) => new Set([...set, jobId]));
      },
      error: () => this.toast.error('Error', 'Failed to apply. You may have already applied.'),
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadJobs();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  private getFilters(): JobSearchFilters {
    const v = this.filterForm.value;
    return {
      title: v.title || undefined,
      location: v.location || undefined,
      skills: v.skills || undefined,
      jobType: v.jobType || undefined,
      experienceMin: v.experienceMin ?? undefined,
      experienceMax: v.experienceMax ?? undefined,
    };
  }

  private loadJobs(): void {
    this.isLoading.set(true);
    this.jobService.searchJobs(this.getFilters(), this.currentPage(), 10).subscribe({
      next: (page) => {
        this.jobs.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  private loadSavedJobIds(): void {
    this.candidateService.getSavedJobs().subscribe({
      next: (jobs) => this.savedJobIds.set(new Set(jobs.map((j) => j.id))),
    });
  }

  private loadAppliedJobIds(): void {
    this.candidateService.getMyApplications(0, 100).subscribe({
      next: (page) => this.appliedJobIds.set(new Set((page.content || []).map((app) => app.jobId))),
    });
  }
}
