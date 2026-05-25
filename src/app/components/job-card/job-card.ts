import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Job } from '../../types/Job.interface';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AppButton } from '../app-button/app-button';
import { MatchScoreBadge } from '../match-score-badge/match-score-badge';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule, CardModule, TagModule, AvatarModule, MatchScoreBadge, AppButton],
  templateUrl: './job-card.html',
  styleUrl: './job-card.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class JobCard {
  @Input() job!:Job;
  @Input() showMatchScore=false;
}
