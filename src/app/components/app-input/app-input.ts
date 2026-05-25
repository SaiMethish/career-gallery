import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";

@Component({
  selector: 'app-input',
  imports: [IconFieldModule, InputIconModule,ReactiveFormsModule],
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
