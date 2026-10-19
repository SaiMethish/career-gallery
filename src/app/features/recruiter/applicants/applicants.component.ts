import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ApplicantResponseDTO, JobApplicationStatus } from '../../../core/models/application.model';
import { JobResponseDTO } from '../../../core/models/job.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css'
})
export class ApplicantsComponent implements OnInit {
  private readonly recruiter = inject(RecruiterService);
  private readonly route = inject(ActivatedRoute);

  readonly applicants = signal<ApplicantResponseDTO[]>([]);
  readonly selectedApplicant = signal<ApplicantResponseDTO | null>(null);
  readonly job = signal<JobResponseDTO | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly statuses = Object.values(JobApplicationStatus);
  readonly JobApplicationStatus = JobApplicationStatus;

  readonly searchTerm = signal('');
  readonly selectedTab = signal<'ALL' | JobApplicationStatus>('ALL');

  readonly tabs: Array<'ALL' | JobApplicationStatus> = [
    'ALL',
    JobApplicationStatus.APPLIED,
    JobApplicationStatus.SHORTLISTED,
    JobApplicationStatus.INTERVIEW,
    JobApplicationStatus.OFFERED,
    JobApplicationStatus.HIRED,
    JobApplicationStatus.REJECTED
  ];

  readonly filteredApplicants = computed(() => {
    let list = this.applicants();
    const tab = this.selectedTab();
    if (tab !== 'ALL') {
      list = list.filter((a) => a.status === tab);
    }
    const q = this.searchTerm().trim().toLowerCase();
    if (q) {
      list = list.filter((a) =>
        (a.candidateName && a.candidateName.toLowerCase().includes(q)) ||
        (a.candidateEmail && a.candidateEmail.toLowerCase().includes(q)) ||
        (a.skills && a.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }
    return list;
  });

  getCountForTab(tab: 'ALL' | JobApplicationStatus): number {
    if (tab === 'ALL') return this.applicants().length;
    return this.applicants().filter((a) => a.status === tab).length;
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    if (!jobId) { this.error.set('Job not found.'); this.loading.set(false); return; }

    this.recruiter.getMyJobs().subscribe({
      next: (jobs) => this.job.set(jobs.find((item) => item.id === jobId)),
      error: () => this.error.set('Unable to load the job posting.'),
    });

    this.recruiter.getJobApplicants(jobId).subscribe({
      next: (page) => {
        this.applicants.set(page.content);
        if (page.content.length > 0) {
          this.selectedApplicant.set(page.content[0]);
        }
        this.loading.set(false);
      },
      error: () => { this.error.set('Unable to load applicants.'); this.loading.set(false); },
    });
  }

  selectApplicant(applicant: ApplicantResponseDTO): void {
    this.selectedApplicant.set(applicant);
  }

  updateStatus(applicant: ApplicantResponseDTO, status: string): void {
    const nextStatus = status as JobApplicationStatus;
    this.recruiter.updateApplicationStatus(applicant.id, nextStatus).subscribe({
      next: (updated) => {
        this.applicants.update((items) => items.map((item) => item.id === updated.id ? updated : item));
        if (this.selectedApplicant()?.id === updated.id) {
          this.selectedApplicant.set(updated);
        }
      },
      error: () => this.error.set('Unable to update this application status.'),
    });
  }

  getResumeDownloadUrl(resumeUrl?: string): string {
    if (!resumeUrl) return '#';
    const clean = resumeUrl.split('/').pop()?.split('\\').pop() || resumeUrl;
    return `${environment.apiUrl}/candidate/profile/resume/download/${encodeURIComponent(clean)}`;
  }

  calculateMatchScore(applicant: ApplicantResponseDTO): number {
    const jobSkills = (this.job()?.skills || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
    if (jobSkills.length === 0) return 88;
    const candSkills = (applicant.skills || []).map((s) => s.toLowerCase().trim());
    if (candSkills.length === 0) return 55;
    const matches = jobSkills.filter((s) => candSkills.some((cs) => cs.includes(s) || s.includes(cs))).length;
    const pct = Math.round((matches / jobSkills.length) * 100);
    return Math.max(50, Math.min(98, pct > 0 ? pct : 65));
  }

  getInitials(name?: string, email?: string): string {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'CA';
  }
}
