/** Notification type — mirrors backend NotificationType enum */
export enum NotificationType {
  APPLICATION_APPLIED = 'APPLICATION_APPLIED',
  APPLICATION_SHORTLISTED = 'APPLICATION_SHORTLISTED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  APPLICATION_INTERVIEW = 'APPLICATION_INTERVIEW',
}

/** Notification — mirrors backend NotificationDTO */
export interface NotificationDTO {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
