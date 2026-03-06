import { type InitData, WORK_TYPES, WEEKDAYS, cellStyle } from "./scheduleTypes";

interface Props {
  initData: InitData;
  schedule: number[][];
  onCellClick?: (workerIdx: number, dayIdx: number) => void;
  cellSize?: number;
}

const ScheduleTable = ({ initData, schedule, onCellClick, cellSize = 34 }: Props) => (
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
        </tr>
      </thead>
      <tbody>
        {initData.workers.map((worker, wIdx) => (
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
              {worker.userName}
            </td>
            {schedule[wIdx]?.map((val, dIdx) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ScheduleTable;
