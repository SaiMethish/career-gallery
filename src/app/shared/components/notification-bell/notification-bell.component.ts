import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OverlayModule } from 'primeng/overlay';
import { ButtonModule } from 'primeng/button';

/** Notification bell icon with unread count badge for shell headers */
@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [RouterLink, OverlayModule, ButtonModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'})
export class NotificationBellComponent {
  @Input() routeLink: string = '/notifications';
}
