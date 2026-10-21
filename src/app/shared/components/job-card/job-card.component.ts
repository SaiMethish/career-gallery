import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JobResponseDTO, JobStatus, JobType } from '../../../core/models/job.model';

/**
 * Dumb presentational job card component.
 * Emits events for save/unsave and apply actions.
 * No service injection — all data via @Input.
 */
@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink, DatePipe,DecimalPipe],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'})
export class JobCardComponent {
  @Input({ required: true }) job!: JobResponseDTO;
  @Input() saved = false;
  @Input() isApplied = false;
  @Input() showApplyButton = true;
  @Output() saveToggled = new EventEmitter<string>();
  @Output() applied = new EventEmitter<string>();
  @Output() matchChecked = new EventEmitter<JobResponseDTO>();

  onSaveToggle(event: Event): void {
    event.preventDefault();
    this.saveToggled.emit(this.job.id);
  }

  onCheckMatch(event: Event): void {
    event.preventDefault();
    this.matchChecked.emit(this.job);
  }

  onApply(): void {
    if (!this.isApplied) {
      this.applied.emit(this.job.id);
    }
  }

  formatJobType(type: JobType): string {
    return { FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract' }[type] ?? type;
  }
}
