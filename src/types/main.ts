import type { User } from "./user.ts";

export interface TodayNote {
  noteId: string;
  content: string;
  date: string;
  createdAt: string;
  user: User;
}

export interface MainData {
  group: { groupName: string; groupProfile: string | null };
  todayWorkers: { day: User[]; night: User[] };
  todayNotes: TodayNote[];
  hasUnreadNotification: boolean;
}
