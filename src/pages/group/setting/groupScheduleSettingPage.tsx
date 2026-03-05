import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, DatePicker, Typography } from "antd";
import { useParams } from "react-router-dom";
import { Dayjs } from "dayjs";
import { api } from "../../../api/axios";

const { Title, Text } = Typography;

interface Worker {
  userId: string;
  userName: string;
  userProfile?: string;
  isNight: boolean;
  targetWorkCount: number;
  admin: boolean;
}

interface InitData {
  numDays: number;
  firstWeekday: number;
  targetWorkCount: number;
  selectedDay: number[];
  selectedNight: number[];
  workers: Worker[];
}

type WorkType = 0 | 1 | 2 | 3 | 4 | 5;

const WORK_TYPES: { value: WorkType; label: string; short: string; color: string; bg: string }[] = [
  { value: 0, label: "빈칸", short: "", color: "#bfbfbf", bg: "#ffffff" },
  { value: 1, label: "주간", short: "주", color: "#1677ff", bg: "#e6f4ff" },
  { value: 2, label: "야간", short: "야", color: "#722ed1", bg: "#f9f0ff" },
  { value: 3, label: "비번", short: "비", color: "#8c8c8c", bg: "#f0f0f0" },
  { value: 4, label: "지정휴무", short: "지", color: "#fa8c16", bg: "#fff7e6" },
  { value: 5, label: "연차", short: "연", color: "#52c41a", bg: "#f6ffed" },
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const cellStyle: React.CSSProperties = {
  border: "1px solid #e8e8e8",
  padding: "4px 2px",
  textAlign: "center",
  fontSize: 12,
  userSelect: "none",
};

const GroupScheduleSettingPage = () => {
  const { group_id } = useParams();
  const [date, setDate] = useState<Dayjs | null>(null);
  const [initData, setInitData] = useState<InitData | null>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [schedule, setSchedule] = useState<number[][]>([]);
  const [selectedType, setSelectedType] = useState<WorkType>(1);

  const handleInit = async () => {
    if (!date) return;
    setInitLoading(true);
    try {
      const res = await api.get("/api/v1/schedule/init", {
        params: { groupId: group_id, date: date.format("YYYY-MM-01") },
      });
      const data: InitData = res.data.data;
      setInitData(data);
      setSchedule(data.workers.map(() => Array(data.numDays).fill(0)));
    } catch {
      alert("초기 데이터 로드에 실패했습니다.");
    } finally {
      setInitLoading(false);
    }
  };

  const handleCellClick = (workerIdx: number, dayIdx: number) => {
    setSchedule((prev) => {
      const next = prev.map((row) => [...row]);
      next[workerIdx][dayIdx] = selectedType;
      return next;
    });
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Title level={4}>스케줄 생성</Title>

      <Flex gap={2} align={"center"}>
        <DatePicker picker="month" value={date} onChange={setDate} placeholder="월 선택" />
        <Button onClick={handleInit} loading={initLoading} disabled={!date}>
          불러오기
        </Button>
      </Flex>

      {initData && (
        <Flex flexDir={"column"} gap={3}>
          {/* 근무형태 선택 */}
          <Flex gap={2} align={"center"} wrap={"wrap"}>
            <Text strong>근무형태:</Text>
            {WORK_TYPES.map((wt) => {
              const isSelected = selectedType === wt.value;
              return (
                <div
                  key={wt.value}
                  onClick={() => setSelectedType(wt.value)}
                  style={{
                    padding: "4px 12px",
                    border: `2px solid ${isSelected ? wt.color : "#d9d9d9"}`,
                    borderRadius: 6,
                    background: isSelected ? wt.bg : "#fafafa",
                    color: isSelected ? wt.color : "#8c8c8c",
                    fontWeight: isSelected ? 700 : 400,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {wt.label}
                </div>
              );
            })}
          </Flex>

          {/* 시간표 그리드 */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", minWidth: "max-content" }}>
              <thead>
                {/* 날짜 행 */}
                <tr>
                  <th
                    style={{
                      ...cellStyle,
                      minWidth: 72,
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
                      style={{ ...cellStyle, minWidth: 34, background: "#fafafa", fontWeight: 500 }}
                    >
                      {i + 1}
                    </th>
                  ))}
                </tr>
                {/* 요일 행 */}
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
                          onClick={() => handleCellClick(wIdx, dIdx)}
                          style={{
                            ...cellStyle,
                            minWidth: 34,
                            height: 32,
                            background: wt.bg,
                            color: wt.color,
                            cursor: "pointer",
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
        </Flex>
      )}
    </Flex>
  );
};

export default GroupScheduleSettingPage;
