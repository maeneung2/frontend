import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Dayjs } from "dayjs";
import { useMutation } from "@tanstack/react-query";
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
  const [schedule, setSchedule] = useState<number[][]>([]);
  const [selectedType, setSelectedType] = useState<WorkType>(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const getDraftKey = () => `schedule_draft_${group_id}_${date?.format("YYYY-MM")}`;

  const { mutate: initSchedule, isPending: initLoading } = useMutation({
    mutationFn: () =>
      api
        .get("/api/v1/schedule/init", {
          params: { groupId: group_id, date: date!.format("YYYY-MM-01") },
        })
        .then((r) => r.data.data as InitData),
    onSuccess: (data) => {
      setInitData(data);
      setSchedule(data.workers.map(() => Array(data.numDays).fill(0)));
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) alert("해당 월의 스케줄이 이미 존재합니다.");
      else alert("초기 데이터 로드에 실패했습니다.");
    },
  });

  const { mutate: generateSchedule, isPending: generateLoading } = useMutation({
    mutationFn: (baseSchedule: number[][]) => {
      const members = initData!.workers.map((w, i) => ({ ...w, isNight: i >= 2 }));
      return api
        .post("/api/v1/schedule/preview", {
          groupId: group_id,
          date: date!.format("YYYY-MM-01"),
          selectedDay: initData!.selectedDay,
          selectedNight: initData!.selectedNight,
          schedule: baseSchedule,
          members,
        })
        .then((r) => r.data.data.schedule as number[][]);
    },
    onSuccess: (generated) => {
      setSchedule(generated);
      setIsGenerated(true);
    },
    onError: () => alert("시간표 생성에 실패했습니다."),
  });

  const { mutate: saveSchedule, isPending: saveLoading } = useMutation({
    mutationFn: () =>
      api.post("/api/v1/schedule", {
        groupId: group_id,
        date: date!.format("YYYY-MM-01"),
        selectedDay: [],
        selectedNight: [],
        schedule,
      }),
    onSuccess: () => alert("저장되었습니다."),
    onError: () => alert("저장에 실패했습니다."),
  });

  const handleInit = () => {
    if (!date) return;
    initSchedule();
  };

  const handleGenerate = () => {
    if (!initData || !date) return;
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

    generateSchedule(baseSchedule);
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
              onSave={() => saveSchedule()}
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