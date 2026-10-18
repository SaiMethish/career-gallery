import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'})
export class SettingsComponent {
  readonly emailAlerts = signal(localStorage.getItem('career-email-alerts') !== 'false');
  readonly compactTables = signal(localStorage.getItem('career-compact-tables') === 'true');
  readonly saved = signal(false);

  save(): void {
    localStorage.setItem('career-email-alerts', String(this.emailAlerts()));
    localStorage.setItem('career-compact-tables', String(this.compactTables()));
    this.saved.set(true);
    window.setTimeout(() => this.saved.set(false), 2500);
  }
}
