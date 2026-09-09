import type { User } from "./user.ts";

export type WorkType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Worker {
  workerId: string;
  fixedWorkType: 0 | 1 | 2;
  isNew: boolean;
  restCount: number;
  prevWorkCount?: number;
  lastWorkType?: WorkType;
  plan: number[];
  user: User;
  userId: string;
}

export interface ScheduleDetail {
  scheduleId: string;
  groupId?: string;
  date: string;
  createdAt: string;
  pattern: WorkType[];
  workers: Worker[];
}

export type FixedShift = "none" | "day" | "night";
export type MemberConfig = Worker & {
  excluded: boolean;
  rotationStart: number;
  fixedShift: FixedShift;
};

export interface InitData {
  numDays: number;
  firstWeekday: number;
  restCount: number;
  selectedDay: number[];
  selectedNight: number[];
  workers: Worker[];
}

export type ShiftMode = "2교대" | "3교대";

export const WORK_TYPES: {
  value: WorkType;
  label: string;
  short: string;
  color: string;
  bg: string;
  shiftMode: ShiftMode | "공통";
}[] = [
  { value: 0, label: "빈칸", short: "", color: "#bfbfbf", bg: "#ffffff", shiftMode: "공통" },
  { value: 1, label: "주간", short: "주", color: "#1677ff", bg: "#e6f4ff", shiftMode: "2교대" },
  { value: 2, label: "야간", short: "야", color: "#722ed1", bg: "#f9f0ff", shiftMode: "2교대" },
  { value: 3, label: "비번", short: "비", color: "#8c8c8c", bg: "#f0f0f0", shiftMode: "2교대" },
  { value: 4, label: "휴무", short: "휴", color: "#fa8c16", bg: "#fff7e6", shiftMode: "공통" },
  { value: 5, label: "연차", short: "연", color: "#52c41a", bg: "#f6ffed", shiftMode: "공통" },
  { value: 6, label: "데이", short: "D", color: "#1677ff", bg: "#e6f4ff", shiftMode: "3교대" },
  { value: 7, label: "이브닝", short: "E", color: "#eb2f96", bg: "#fff0f6", shiftMode: "3교대" },
  { value: 8, label: "나이트", short: "N", color: "#722ed1", bg: "#f9f0ff", shiftMode: "3교대" },
];

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const cellStyle: React.CSSProperties = {
  border: "1px solid #e8e8e8",
  padding: "4px 2px",
  textAlign: "center",
  fontSize: 12,
  userSelect: "none",
};
