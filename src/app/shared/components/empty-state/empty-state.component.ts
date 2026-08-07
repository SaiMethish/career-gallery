import { Component, Input } from '@angular/core';

/** Dumb empty state component shown when a list or data set has no results */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'})
export class EmptyStateComponent {
  @Input() icon = 'pi-inbox';
  @Input({ required: true }) title!: string;
  @Input() message = '';
}
