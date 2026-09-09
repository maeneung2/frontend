import type { Comment, Notice } from "./notice.ts";

export interface Invite {
  groupId: string;
  groupName: string;
  groupProfile: string | null;
  inviteId: string;
  status: string;
}

export interface NotificationItem {
  notificationId: string;
  type: number;
  content: string;
  url: string | null;
  data?: Invite | Notice | Comment;
  read: boolean;
  createdAt: string;
}
