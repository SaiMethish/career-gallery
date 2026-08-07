import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Shown when a user tries to access a route they don't have permission for */
@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css'})
export class NotAuthorizedComponent {}
