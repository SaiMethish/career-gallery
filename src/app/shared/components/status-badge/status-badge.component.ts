import { Component, Input } from '@angular/core';
import { JobApplicationStatus } from '../../../core/models/application.model';
import { JobStatus } from '../../../core/models/job.model';

/** Dumb status badge for JobApplicationStatus and JobStatus values */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: JobApplicationStatus | JobStatus | string;

  get label(): string {
    return this.status?.toString().replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) ?? '';
  }

  get badgeClass(): string {
    const map: Record<string, string> = {
      [JobApplicationStatus.APPLIED]: 'badge badge-applied',
      [JobApplicationStatus.SHORTLISTED]: 'badge badge-shortlisted',
      [JobApplicationStatus.INTERVIEW]: 'badge badge-interview',
      [JobApplicationStatus.OFFERED]: 'badge badge-offered',
      [JobApplicationStatus.HIRED]: 'badge badge-hired',
      [JobApplicationStatus.REJECTED]: 'badge badge-rejected',
      [JobApplicationStatus.WITHDRAWN]: 'badge badge-withdrawn',
      [JobStatus.OPEN]: 'badge badge-open',
      [JobStatus.CLOSED]: 'badge badge-closed',
      [JobStatus.EXPIRED]: 'badge badge-withdrawn',
    };
    return map[this.status] ?? 'badge badge-withdrawn';
  }
}
