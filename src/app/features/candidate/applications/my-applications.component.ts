import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApplicationResponseDTO, JobApplicationStatus } from '../../../core/models/application.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

/** Candidate's applications tracker — matches Stitch "My Applications" screen */
@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css'})
export class MyApplicationsComponent implements OnInit {
  private readonly candidateService = inject(CandidateService);
  private readonly toast = inject(ToastService);

  readonly applications = signal<ApplicationResponseDTO[]>([]);
  readonly isLoading = signal(true);
  readonly JobApplicationStatus = JobApplicationStatus;

  ngOnInit(): void {
    this.loadApplications();
  }

  withdraw(applicationId: string): void {
    this.candidateService.withdrawApplication(applicationId).subscribe({
      next: () => {
        this.applications.update((apps) =>
          apps.map((a) =>
            a.id === applicationId ? { ...a, status: JobApplicationStatus.WITHDRAWN } : a
          )
        );
        this.toast.success('Withdrawn', 'Your application has been withdrawn.');
      },
      error: () => this.toast.error('Error', 'Failed to withdraw application.'),
    });
  }

  private loadApplications(): void {
    this.candidateService.getMyApplications(0, 50).subscribe({
      next: (page) => {
        this.applications.set(page.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
