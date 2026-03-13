import { type InitData, WORK_TYPES, WEEKDAYS, cellStyle } from "../../types/schedule.ts";

interface Props {
  initData: InitData;
  schedule: number[][];
  onCellClick?: (workerIdx: number, dayIdx: number) => void;
  cellSize?: number;
}

const ScheduleTable = ({ initData, schedule, onCellClick, cellSize = 34 }: Props) => {
  const dayCounts = Array.from({ length: initData.numDays }, (_, dIdx) =>
    schedule.reduce((cnt, row) => cnt + (row[dIdx] === 1 || row[dIdx] === 6 ? 1 : 0), 0)
  );
  const nightCounts = Array.from({ length: initData.numDays }, (_, dIdx) =>
    schedule.reduce(
      (cnt, row) => cnt + (row[dIdx] === 2 || row[dIdx] === 7 || row[dIdx] === 8 ? 1 : 0),
      0
    )
  );

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
      <table style={{ borderCollapse: "collapse", minWidth: "max-content" }}>
        <thead>
          <tr>
            <th
              style={{
                ...cellStyle,
                minWidth: 48,
                background: "#fafafa",
                position: "sticky",
                left: 0,
                zIndex: 1,
              }}
            >
              날짜
            </th>
            {Array.from({ length: initData.numDays }, (_, i) => (
              <th
                key={i}
                style={{ ...cellStyle, minWidth: cellSize, background: "#fafafa", fontWeight: 500 }}
              >
                {i + 1}
              </th>
            ))}
            <th style={{ ...cellStyle, minWidth: 40, background: "#fafafa" }}>휴일</th>
          </tr>
          <tr>
            <th
              style={{
                ...cellStyle,
                background: "#fafafa",
                position: "sticky",
                left: 0,
                zIndex: 1,
              }}
            >
              요일
            </th>
            {Array.from({ length: initData.numDays }, (_, i) => {
              const dow = (initData.firstWeekday + i) % 7;
              const isSun = dow === 0;
              const isSat = dow === 6;
              return (
                <th
                  key={i}
                  style={{
                    ...cellStyle,
                    background: "#fafafa",
                    color: isSun ? "#ff4d4f" : isSat ? "#1677ff" : undefined,
                    fontWeight: 400,
                  }}
                >
                  {WEEKDAYS[dow]}
                </th>
              );
            })}
            <th style={{ ...cellStyle, background: "#fafafa" }} />
          </tr>
        </thead>
        <tbody>
          {initData.workers.map((worker, wIdx) => {
            const row = schedule[wIdx] ?? [];
            const holidayCount = row.filter((v) => v === 0 || v === 4).length;
            return (
              <tr key={worker.userId}>
                <td
                  style={{
                    ...cellStyle,
                    minWidth: 72,
                    background: "#fafafa",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                    padding: "4px 8px",
                  }}
                >
                  {worker.user.userName}
                </td>
                {row.map((val, dIdx) => {
                  const wt = WORK_TYPES[val];
                  return (
                    <td
                      key={dIdx}
                      onClick={onCellClick ? () => onCellClick(wIdx, dIdx) : undefined}
                      style={{
                        ...cellStyle,
                        minWidth: cellSize,
                        height: cellSize - 2,
                        background: wt.bg,
                        color: wt.color,
                        cursor: onCellClick ? "pointer" : "default",
                        fontWeight: val !== 0 ? 700 : 400,
                      }}
                    >
                      {wt.short}
                    </td>
                  );
                })}
                <td
                  style={{
                    ...cellStyle,
                    minWidth: 40,
                    background: "#fafafa",
                    fontWeight: 600,
                    color: "#52c41a",
                  }}
                >
                  {holidayCount}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td
              style={{
                ...cellStyle,
                minWidth: 72,
                background: "#e6f4ff",
                position: "sticky",
                left: 0,
                zIndex: 1,
                fontWeight: 600,
                color: "#1677ff",
                padding: "4px 8px",
                whiteSpace: "nowrap",
              }}
            >
              주간
            </td>
            {dayCounts.map((cnt, i) => (
              <td
                key={i}
                style={{
                  ...cellStyle,
                  minWidth: cellSize,
                  background: "#e6f4ff",
                  color: cnt > 0 ? "#1677ff" : "#bfbfbf",
                  fontWeight: cnt > 0 ? 700 : 400,
                }}
              >
                {cnt > 0 ? cnt : ""}
              </td>
            ))}
            <td style={{ ...cellStyle, minWidth: 40, background: "#e6f4ff" }} />
          </tr>
          <tr>
            <td
              style={{
                ...cellStyle,
                minWidth: 72,
                background: "#f9f0ff",
                position: "sticky",
                left: 0,
                zIndex: 1,
                fontWeight: 600,
                color: "#722ed1",
                padding: "4px 8px",
                whiteSpace: "nowrap",
              }}
            >
              야간
            </td>
            {nightCounts.map((cnt, i) => (
              <td
                key={i}
                style={{
                  ...cellStyle,
                  minWidth: cellSize,
                  background: "#f9f0ff",
                  color: cnt > 0 ? "#722ed1" : "#bfbfbf",
                  fontWeight: cnt > 0 ? 700 : 400,
                }}
              >
                {cnt > 0 ? cnt : ""}
              </td>
            ))}
            <td style={{ ...cellStyle, minWidth: 40, background: "#f9f0ff" }} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ScheduleTable;
