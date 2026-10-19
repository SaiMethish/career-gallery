import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationDTO, NotificationType } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);

  // State
  notifications = signal<NotificationDTO[]>([]);
  activeTab = signal<'ALL' | 'APPLICATIONS' | 'INTERVIEWS' | 'SYSTEM'>('ALL');
  loading = signal(false);

  // Computed state for filtered notifications
  filteredNotifications = computed(() => {
    const currentTab = this.activeTab();
    const all = this.notifications();
    
    if (currentTab === 'ALL') return all;
    
    return all.filter(n => {
      switch (currentTab) {
        case 'APPLICATIONS':
          return [NotificationType.APPLICATION_APPLIED, NotificationType.APPLICATION_SHORTLISTED, NotificationType.APPLICATION_REJECTED].includes(n.type);
        case 'INTERVIEWS':
          return n.type === NotificationType.APPLICATION_INTERVIEW;
        case 'SYSTEM':
          // We don't have a specific system enum yet, so return none for now
          return false; 
        default:
          return true;
      }
    });
  });

  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
        this.loading.set(false);
      }
    });
  }

  setTab(tab: 'ALL' | 'APPLICATIONS' | 'INTERVIEWS' | 'SYSTEM'): void {
    this.activeTab.set(tab);
  }

  markAsRead(id: string): void {
    // Optimistic update
    this.notifications.update(current => 
      current.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    
    this.notificationService.markAsRead(id).subscribe({
      error: (err) => {
        console.error('Failed to mark as read', err);
        // Revert on error could go here
        this.loadNotifications();
      }
    });
  }

  markAllAsRead(): void {
    const unreadCount = this.notifications().filter(n => !n.isRead).length;
    if (unreadCount === 0) return;

    // Optimistically mark all as read
    this.notifications.update(current => current.map(n => ({ ...n, isRead: true })));

    this.notificationService.markAllAsRead().subscribe({
      error: (err) => {
        console.error('Failed to mark all as read', err);
        this.loadNotifications();
      }
    });
  }

  // Helpers for template
  getIconForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.APPLICATION_APPLIED:
      case NotificationType.APPLICATION_SHORTLISTED:
      case NotificationType.APPLICATION_REJECTED:
        return 'pi pi-file';
      case NotificationType.APPLICATION_INTERVIEW:
        return 'pi pi-video';
      default:
        return 'pi pi-bell';
    }
  }

  getTitleForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.APPLICATION_APPLIED:
        return 'Application Received';
      case NotificationType.APPLICATION_SHORTLISTED:
        return 'Application Shortlisted';
      case NotificationType.APPLICATION_REJECTED:
        return 'Application Update';
      case NotificationType.APPLICATION_INTERVIEW:
        return 'Interview Scheduled';
      default:
        return 'System Update';
    }
  }

  getIconClassForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.APPLICATION_APPLIED:
      case NotificationType.APPLICATION_SHORTLISTED:
      case NotificationType.APPLICATION_REJECTED:
        return 'bg-primary-fixed text-on-primary-fixed';
      case NotificationType.APPLICATION_INTERVIEW:
        return 'bg-tertiary-container text-on-tertiary-container';
      default:
        return 'bg-surface-container-highest text-on-surface-variant';
    }
  }

  getLabelForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.APPLICATION_APPLIED:
      case NotificationType.APPLICATION_SHORTLISTED:
      case NotificationType.APPLICATION_REJECTED:
        return 'Application';
      case NotificationType.APPLICATION_INTERVIEW:
        return 'Interview';
      default:
        return 'System';
    }
  }
}
