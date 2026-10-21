import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobService } from '../../../core/services/job.service';
import { CandidateService } from '../../../core/services/candidate.service';
import {
  JobResponseDTO,
  JobSearchFilters,
  PageResponse,
  JobType,
  JobMatchResponseDTO,
} from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../core/services/toast.service';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

/** Job search and browse page — matches Stitch "Browse Jobs" + "Search Results" screens */
@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JobCardComponent,
    EmptyStateComponent,
    SelectModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css',
})
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

  // ATS & Indian Location filters
  readonly cities = signal<string[]>([]);
  readonly companies = signal<string[]>([]);
  readonly isSyncing = signal(false);

  // Resume Match state
  readonly selectedMatch = signal<JobMatchResponseDTO | null>(null);
  readonly isMatching = signal(false);
  readonly showMatchDialog = signal(false);

  filterForm!: FormGroup;

  readonly jobTypeOptions = [
    { label: 'Full Time', value: JobType.FULL_TIME },
    { label: 'Part Time', value: JobType.PART_TIME },
    { label: 'Contract', value: JobType.CONTRACT },
  ];

  readonly sourceOptions = [
    { label: 'All Sources', value: '' },
    { label: 'Greenhouse ATS', value: 'GREENHOUSE' },
    { label: 'Direct / Internal', value: 'INTERNAL' },
  ];

  readonly categoryOptions = [
    { label: 'All Categories', value: '' },
    { label: 'Product Companies', value: 'PRODUCT' },
    { label: 'Tech Services', value: 'SERVICE' },
  ];

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      location: [''],
      skills: [''],
      jobType: [null],
      source: [''],
      companyCategory: [''],
      companyName: [''],
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
    this.loadFilterMetadata();
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

  onCheckMatch(job: JobResponseDTO): void {
    this.showMatchDialog.set(true);
    this.isMatching.set(true);
    this.selectedMatch.set(null);

    this.jobService.getJobMatch(job.id).subscribe({
      next: (match) => {
        this.selectedMatch.set(match);
        this.isMatching.set(false);
      },
      error: (err) => {
        this.isMatching.set(false);
        this.toast.error(
          'Match Analysis',
          'Could not analyze match. Make sure your resume is uploaded in Profile.'
        );
      },
    });
  }

  closeMatchDialog(): void {
    this.showMatchDialog.set(false);
    this.selectedMatch.set(null);
  }

  onTriggerSync(): void {
    if (this.isSyncing()) return;
    this.isSyncing.set(true);
    this.toast.info('Syncing ATS', 'Fetching fresh Indian jobs from Greenhouse boards...');

    this.jobService.triggerAtsSync().subscribe({
      next: (summary) => {
        this.isSyncing.set(false);
        this.toast.success(
          'ATS Sync Complete',
          `Added ${summary.newJobsAdded} new jobs, updated ${summary.jobsUpdated}, removed ${summary.expiredJobsRemoved} expired.`
        );
        this.loadJobs();
        this.loadFilterMetadata();
      },
      error: () => {
        this.isSyncing.set(false);
        this.toast.error('Sync Error', 'Failed to complete ATS sync.');
      },
    });
  }

  onCityChipClick(city: string): void {
    const current = this.filterForm.get('location')?.value;
    if (current === city) {
      this.filterForm.patchValue({ location: '' });
    } else {
      this.filterForm.patchValue({ location: city });
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadJobs();
  }

  clearFilters(): void {
    this.filterForm.reset({
      title: '',
      location: '',
      skills: '',
      jobType: null,
      source: '',
      companyCategory: '',
      companyName: '',
      experienceMin: null,
      experienceMax: null,
    });
  }

  private getFilters(): JobSearchFilters {
    const v = this.filterForm.value;
    return {
      title: v.title || undefined,
      location: v.location || undefined,
      skills: v.skills || undefined,
      jobType: v.jobType || undefined,
      source: v.source || undefined,
      companyCategory: v.companyCategory || undefined,
      companyName: v.companyName || undefined,
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

  private loadFilterMetadata(): void {
    this.jobService.getCities().subscribe({
      next: (cities) => this.cities.set(cities || []),
    });
    this.jobService.getCompanies().subscribe({
      next: (companies) => this.companies.set(companies || []),
    });
  }
}
