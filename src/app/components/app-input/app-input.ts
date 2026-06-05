import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input',
  imports: [IconFieldModule, InputIconModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './app-input.html',
  styleUrl: './app-input.scss',
})
export class AppInput {
  @Input() label='';
  @Input() placeholder='';
  @Input() control:FormControl=new FormControl('');
  @Input() type='text';
  @Input() icon='';
}
