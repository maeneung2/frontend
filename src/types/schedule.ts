export interface ScheduleItem {
  scheduleId: string;
  date: string;
  createdAt: string;
}

export interface ScheduleWorker {
  id: string;
  userId: string;
  userName: string;
  userProfile: string | null;
  isNight: boolean;
  isNew: boolean;
  admin: boolean;
  targetWorkCount: number;
  scheduleId: string;
  user?: {
    userId: string;
    userName: string;
    userProfile: string | null;
  };
}

export interface ScheduleDetail {
  scheduleId: string;
  groupId?: string;
  date: string;
  createdAt: string;
  schedule: number[][];
  workers: ScheduleWorker[];
}