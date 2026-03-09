import type { User } from "./user.ts";

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
  targetWorkCount: number;
  scheduleId: string;
  user?: User;
}

export interface ScheduleDetail {
  scheduleId: string;
  groupId?: string;
  date: string;
  createdAt: string;
  schedule: number[][];
  workers: ScheduleWorker[];
}
