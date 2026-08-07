import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponseDTO, JobStatus } from '../../../core/models/job.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './manage-jobs.component.html',
  styleUrl: './manage-jobs.component.css'})
export class ManageJobsComponent implements OnInit {
  private readonly recruiterService = inject(RecruiterService);
  readonly jobs = signal<JobResponseDTO[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.recruiterService.getMyJobs().subscribe({
      next: (j) => { this.jobs.set(j); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
