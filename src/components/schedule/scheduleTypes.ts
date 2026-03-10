export interface Worker {
  userId: string;
  userName: string;
  userProfile?: string | null;
  isNight: boolean;
  targetWorkCount: number;
}

export interface InitData {
  numDays: number;
  firstWeekday: number;
  targetWorkCount: number;
  selectedDay: number[];
  selectedNight: number[];
  workers: Worker[];
}

export type WorkType = 0 | 1 | 2 | 3 | 4 | 5;

export const WORK_TYPES: {
  value: WorkType;
  label: string;
  short: string;
  color: string;
  bg: string;
}[] = [
  { value: 0, label: "빈칸", short: "", color: "#bfbfbf", bg: "#ffffff" },
  { value: 1, label: "주간", short: "주", color: "#1677ff", bg: "#e6f4ff" },
  { value: 2, label: "야간", short: "야", color: "#722ed1", bg: "#f9f0ff" },
  { value: 3, label: "비번", short: "비", color: "#8c8c8c", bg: "#f0f0f0" },
  { value: 4, label: "지정휴무", short: "지", color: "#fa8c16", bg: "#fff7e6" },
  { value: 5, label: "연차", short: "연", color: "#52c41a", bg: "#f6ffed" },
];

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const cellStyle: React.CSSProperties = {
  border: "1px solid #e8e8e8",
  padding: "4px 2px",
  textAlign: "center",
  fontSize: 12,
  userSelect: "none",
};
