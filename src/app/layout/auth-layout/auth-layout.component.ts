import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';

/** Centered card layout for authentication pages (login, register) */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
