import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { JobResponseDTO, JobStatus, JobType } from '../../../core/models/job.model';
import { ToastService } from '../../../core/services/toast.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, EmptyStateComponent],
  templateUrl: './admin-jobs.component.html',
  styleUrl: './admin-jobs.component.css',
})
export class AdminJobsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  readonly jobs = signal<JobResponseDTO[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal<number>(0);
  readonly totalPages = signal<number>(1);
  readonly totalElements = signal<number>(0);
  readonly deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(page = 0): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.adminService.getAllJobs(page, 10).subscribe({
      next: (res) => {
        this.jobs.set(res.content);
        this.totalPages.set(res.totalPages || 1);
        this.totalElements.set(res.totalElements || 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Load Error', 'Unable to load platform jobs list.');
      },
    });
  }

  deleteJob(job: JobResponseDTO): void {
    if (!confirm(`Are you sure you want to permanently remove "${job.title}" by "${job.companyName}"? This action cannot be undone.`)) {
      return;
    }

    this.deletingId.set(job.id);
    this.adminService.deleteJob(job.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.jobs.update((list) => list.filter((j) => j.id !== job.id));
        this.totalElements.update((cnt) => Math.max(0, cnt - 1));
        this.toast.success('Job Removed', `"${job.title}" has been permanently deleted.`);
      },
      error: () => {
        this.deletingId.set(null);
        this.toast.error('Deletion Failed', 'Failed to delete the job.');
      },
    });
  }

  formatJobType(type: JobType): string {
    return { FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract' }[type] ?? type;
  }

  nextPage(): void {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.loadJobs(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.loadJobs(this.currentPage() - 1);
    }
  }
}
