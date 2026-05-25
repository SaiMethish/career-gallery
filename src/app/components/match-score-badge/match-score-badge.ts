import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-match-score-badge',
  imports: [TagModule],
  templateUrl: './match-score-badge.html',
  styleUrl: './match-score-badge.scss',
})
export class MatchScoreBadge {
  @Input() score=0;

}
