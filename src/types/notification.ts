export interface NotificationItem {
  notificationId: string;
  type: string;
  content: string;
  url: string | null;
  read: boolean;
  createdAt: string;
}