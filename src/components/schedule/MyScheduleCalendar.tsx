import { Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { WORK_TYPES, WEEKDAYS } from "./scheduleTypes";

const { Text } = Typography;

interface Props {
  date: Dayjs;
  schedule: number[];
  noteDays?: number[];
  onDayClick?: (date: Dayjs) => void;
}

const MyScheduleCalendar = ({ date, schedule, noteDays = [], onDayClick }: Props) => {
  const numDays = date.daysInMonth();
  const firstWeekday = date.day();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: numDays }, (_, i) => i),
  ];

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <div style={{ width: "100%" }}>
      {/* 요일 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: 4,
        }}
      >
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              padding: "4px 0",
              fontSize: 12,
              fontWeight: 600,
              color: i === 0 ? "#ff4d4f" : i === 6 ? "#1677ff" : "#595959",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      {rows.map((row, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4,
            marginBottom: 4,
          }}
        >
          {row.map((dayIdx, colIdx) => {
            if (dayIdx === null) return <div key={colIdx} />;

            const val = schedule[dayIdx] ?? 0;
            const wt = WORK_TYPES[val];
            const dow = colIdx;
            const isToday = dayjs().isSame(date.date(dayIdx + 1), "day");
            const hasNote = noteDays.includes(dayIdx);

            return (
              <div
                key={colIdx}
                onClick={() => onDayClick?.(date.date(dayIdx + 1))}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  background: val !== 0 ? wt.bg : "#fafafa",
                  border: isToday
                    ? `2px solid ${val !== 0 ? wt.color : "#1677ff"}`
                    : "1px solid #f0f0f0",
                  gap: 2,
                  position: "relative",
                  cursor: onDayClick ? "pointer" : "default",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isToday ? 700 : 400,
                    color: dow === 0 ? "#ff4d4f" : dow === 6 ? "#1677ff" : "#262626",
                    lineHeight: 1,
                  }}
                >
                  {dayIdx + 1}
                </Text>
                {val !== 0 && (
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: wt.color,
                      lineHeight: 1,
                    }}
                  >
                    {wt.short}
                  </Text>
                )}
                {hasNote && (
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#fa8c16",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MyScheduleCalendar;
