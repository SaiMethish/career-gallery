import { Component, input, Input } from '@angular/core';
import { ButtonSeverity, Button } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [Button],
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss',
})
export class AppButton {
  @Input() label='';
  @Input() icon='';
  @Input() severity:ButtonSeverity='primary';
  @Input() loading=false;
  @Input() disabled=false;

}
