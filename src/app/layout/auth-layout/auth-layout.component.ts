import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Centered card layout for authentication pages (login, register) */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'})
export class AuthLayoutComponent {}
