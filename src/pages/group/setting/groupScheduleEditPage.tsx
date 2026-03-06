import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Dayjs } from "dayjs";
import { api } from "../../../api/axios";
import type { InitData, WorkType } from "../../../components/schedule/scheduleTypes";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import WorkTypeSelector from "../../../components/schedule/WorkTypeSelector";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleActionBar from "../../../components/schedule/ScheduleActionBar";
import ScheduleFullscreenOverlay from "../../../components/schedule/ScheduleFullscreenOverlay";

const { Title } = Typography;

const GroupScheduleEditPage = () => {
  const { group_id } = useParams();
  const [date, setDate] = useState<Dayjs | null>(null);
  const [initData, setInitData] = useState<InitData | null>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [schedule, setSchedule] = useState<number[][]>([]);
  const [selectedType, setSelectedType] = useState<WorkType>(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

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
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        alert("해당 월의 스케줄이 이미 존재합니다.");
      } else {
        alert("초기 데이터 로드에 실패했습니다.");
      }
    } finally {
      setInitLoading(false);
    }
  };

  const getDraftKey = () => `schedule_draft_${group_id}_${date?.format("YYYY-MM")}`;

  const handleGenerate = async () => {
    if (!initData || !date) return;
    setGenerateLoading(true);
    try {
      const key = getDraftKey();
      const saved = localStorage.getItem(key);
      let baseSchedule: number[][];

      if (saved) {
        baseSchedule = JSON.parse(saved);
        setSchedule(baseSchedule);
      } else {
        baseSchedule = schedule;
        localStorage.setItem(key, JSON.stringify(schedule));
      }

      const members = initData.workers.map((w, i) => ({ ...w, isNight: i >= 2 }));
      const res = await api.post(`/api/v1/schedule/preview`, {
        groupId: group_id,
        date: date.format("YYYY-MM-01"),
        selectedDay: initData.selectedDay,
        selectedNight: initData.selectedNight,
        schedule: baseSchedule,
        members,
      });
      setSchedule(res.data.data.schedule);
      setIsGenerated(true);
    } catch {
      alert("시간표 생성에 실패했습니다.");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleReset = () => {
    const key = getDraftKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      setSchedule(JSON.parse(saved));
      localStorage.removeItem(key);
    }
    setIsGenerated(false);
  };

  const handleSave = async () => {
    if (!initData || !date) return;
    setSaveLoading(true);
    try {
      await api.post("/api/v1/schedule", {
        groupId: group_id,
        date: date.format("YYYY-MM-01"),
        selectedDay: [],
        selectedNight: [],
        schedule,
      });
      alert("저장되었습니다.");
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCellClick = (workerIdx: number, dayIdx: number) => {
    setSchedule((prev) => {
      const next = prev.map((row) => [...row]);
      next[workerIdx][dayIdx] = selectedType;
      if (selectedType === 2 && dayIdx + 1 < next[workerIdx].length) {
        next[workerIdx][dayIdx + 1] = 3;
      }
      return next;
    });
  };

  return (
    <>
      <Flex flexDir={"column"} gap={4} p={4}>
        <Title level={4}>스케줄 생성</Title>

        <ScheduleHeader
          date={date}
          onDateChange={setDate}
          onInit={handleInit}
          initLoading={initLoading}
        />

        {initData && (
          <Flex flexDir={"column"} gap={3}>
            <Flex justify={"space-between"} align={"center"}>
              <WorkTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
              <Button
                icon={<FullscreenOutlined />}
                onClick={() => setFullscreen(true)}
                size="middle"
                style={{ flexShrink: 0 }}
              />
            </Flex>
            <ScheduleTable initData={initData} schedule={schedule} onCellClick={handleCellClick} />
            <ScheduleActionBar
              isGenerated={isGenerated}
              generateLoading={generateLoading}
              saveLoading={saveLoading}
              onGenerate={handleGenerate}
              onReset={handleReset}
              onSave={handleSave}
            />
          </Flex>
        )}
      </Flex>

      {fullscreen && initData && (
        <ScheduleFullscreenOverlay onClose={() => setFullscreen(false)}>
          <Flex justify={"space-between"} align={"center"} flexShrink={0}>
            <WorkTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
          </Flex>
          <ScheduleTable
            initData={initData}
            schedule={schedule}
            onCellClick={handleCellClick}
            cellSize={44}
          />
        </ScheduleFullscreenOverlay>
      )}
    </>
  );
};

export default GroupScheduleEditPage;
