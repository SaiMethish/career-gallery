import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Global application footer presenting legal attribution,
 * third-party ATS feed disclaimer, and platform copyright.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
