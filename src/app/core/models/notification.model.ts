/** Notification type — mirrors backend NotificationType enum */
export enum NotificationType {
  APPLICATION_STATUS = 'APPLICATION_STATUS',
  NEW_JOB = 'NEW_JOB',
  GENERAL = 'GENERAL',
}

/** Notification — mirrors backend NotificationDTO */
export interface NotificationDTO {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
