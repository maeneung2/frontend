export interface TodayUser {
  userId: string;
  userName: string;
  userProfile: string | null;
}

export interface TodayNote {
  noteId: string;
  content: string;
  date: string;
  createdAt: string;
  user: TodayUser;
}

export interface MainData {
  group: { groupName: string; groupProfile: string | null };
  todayWorkers: { day: TodayUser[]; night: TodayUser[] };
  todayNotes: TodayNote[];
}