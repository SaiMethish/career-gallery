import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule
  ],
  templateUrl: './password-input.html',
  styleUrls: ['./password-input.scss']
})
export class PasswordInput{

  @Input() label = '';
  @Input() placeholder = '';
  @Input() control!: FormControl;
  
}
