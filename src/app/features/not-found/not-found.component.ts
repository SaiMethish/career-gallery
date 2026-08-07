import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** 404 Not Found page — matches Stitch "404 - Page Not Found" screen */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'})
export class NotFoundComponent {}
