import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Modal, Spin } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import type {
  InitData,
  WorkType,
  ScheduleDetail,
  MemberConfig,
} from "../../../components/schedule/scheduleTypes";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import WorkTypeSelector from "../../../components/schedule/WorkTypeSelector";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleActionBar from "../../../components/schedule/ScheduleActionBar";
import ScheduleFullscreenOverlay from "../../../components/schedule/ScheduleFullscreenOverlay";
import PageHeader from "../../../components/common/PageHeader";
import ScheduleMemberSettingModal from "../../../components/schedule/ScheduleMemberSettingModal";

const GroupScheduleEditPage = () => {
  const { group_id, schedule_id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!schedule_id;

  // 공통 상태
  const [schedule, setSchedule] = useState<number[][]>([]);
  const [selectedType, setSelectedType] = useState<WorkType>(1);
  const [fullscreen, setFullscreen] = useState(false);

  // 생성 모드 전용
  const [date, setDate] = useState<Dayjs | null>(null);
  const [initData, setInitData] = useState<InitData | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberConfigs, setMemberConfigs] = useState<MemberConfig[]>([]);

  // 편집 모드 전용
  const [isDirty, setIsDirty] = useState(false);

  // 편집 모드: 기존 스케줄 로드
  const { data: detail, isLoading: detailLoading } = useQuery<ScheduleDetail>({
    queryKey: ["schedule-detail", schedule_id],
    queryFn: () => api.get(`/api/v1/schedule/${schedule_id}`).then((r) => r.data.data),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (detail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchedule(detail.workers.map((w) => [...w.plan]));
    }
  }, [detail?.scheduleId]);

  // 편집 모드: initData 빌드
  const editInitData: InitData | null = detail
    ? {
        numDays: dayjs(detail.date).daysInMonth(),
        firstWeekday: dayjs(detail.date).day(),
        restCount: 0,
        selectedDay: [],
        selectedNight: [],
        workers: detail.workers,
      }
    : null;

  const getDraftKey = () => `schedule_draft_${group_id}_${date?.format("YYYY-MM")}`;

  // 생성 모드 mutations
  const { mutate: initSchedule, isPending: initLoading } = useMutation<InitData>({
    mutationFn: () =>
      api
        .get("/api/v1/schedule/init", {
          params: { groupId: group_id, date: date!.format("YYYY-MM-01") },
        })
        .then((r) => r.data.data),
    onSuccess: (raw) => {
      const data: InitData = { ...raw };
      setInitData(data);
      setSchedule(data.workers.map((w) => w.plan));
      setMemberConfigs(
        raw.workers.map((w) => ({
          excluded: false,
          ...w,
        }))
      );
      setMemberModalOpen(true);
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) alert("해당 월의 스케줄이 이미 존재합니다.");
      else alert("초기 데이터 로드에 실패했습니다.");
    },
  });

  const { mutate: generateSchedule, isPending: generateLoading } = useMutation({
    mutationFn: () => {
      const activeRawWorkers = memberConfigs
        .filter((w) => !w.excluded)
        .map((w, idx) => ({ ...w, plan: schedule[idx] }));

      return api
        .post("/api/v1/schedule/preview", {
          groupId: group_id,
          date: date!.format("YYYY-MM-01"),
          selectedDay: [],
          selectedNight: [],
          workers: activeRawWorkers,
        })
        .then((r) => r.data.data);
    },
    onSuccess: (data: ScheduleDetail) => {
      setSchedule(data.workers.map((w) => [...w.plan]));
      setIsGenerated(true);
    },
    onError: () => alert("시간표 생성에 실패했습니다."),
  });

  const { mutate: saveCreate, isPending: saveCreateLoading } = useMutation({
    mutationFn: () => {
      const workers = memberConfigs
        .filter((m) => !m.excluded)
        .map((w, idx) => ({ ...w, plan: schedule[idx] }));
      return api.post("/api/v1/schedule", {
        groupId: group_id,
        date: date!.format("YYYY-MM-01"),
        selectedDay: [],
        selectedNight: [],
        workers,
      });
    },
    onSuccess: () => navigate(`/group/${group_id}/setting/schedule`),
    onError: () => alert("저장에 실패했습니다."),
  });

  // 편집 모드 mutation
  const { mutate: saveEdit, isPending: saveEditLoading } = useMutation({
    mutationFn: async () => {
      if (!editInitData) return;
      const workers = editInitData.workers.map((w, idx) => ({ ...w, plan: schedule[idx] }));
      return await api.patch(`/api/v1/schedule/${schedule_id}`, { workers });
    },
    onSuccess: () => navigate(`/group/${group_id}/setting/schedule`),
    onError: () => alert("저장에 실패했습니다."),
  });

  const handleBack = () => {
    const hasWork = isEditMode ? isDirty : !!initData;
    if (!hasWork) {
      navigate(-1);
      return;
    }
    Modal.confirm({
      title: "페이지를 나가시겠습니까?",
      content: isEditMode ? "저장하지 않은 변경사항이 사라집니다." : "작업 중인 내용이 사라집니다.",
      okText: "나가기",
      cancelText: "취소",
      okButtonProps: { danger: true },
      onOk: () => {
        if (!isEditMode) localStorage.removeItem(getDraftKey());
        navigate(-1);
      },
    });
  };

  const handleCellClick = (workerIdx: number, dayIdx: number) => {
    const originalIdx = isEditMode ? workerIdx : (activeIndices[workerIdx] ?? workerIdx);
    setSchedule((prev) => {
      const next = prev.map((row) => [...row]);
      next[originalIdx][dayIdx] = selectedType;
      if (selectedType === 2 && dayIdx + 1 < next[originalIdx].length) {
        next[originalIdx][dayIdx + 1] = 3;
      }
      return next;
    });
    if (isEditMode) setIsDirty(true);
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
      localStorage.setItem(key, JSON.stringify(schedule));
    }

    generateSchedule();
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

  // 편집 모드 로딩
  if (isEditMode && detailLoading) {
    return (
      <Flex justify={"center"} align={"center"} p={8}>
        <Spin />
      </Flex>
    );
  }

  // 생성 모드: 제외 멤버 필터링
  const activeIndices = memberConfigs.map((m, i) => (!m.excluded ? i : -1)).filter((i) => i !== -1);

  const createInitData: InitData | null = initData
    ? {
        ...initData,
        workers: memberConfigs.filter((m) => !m.excluded),
      }
    : null;

  // const createSchedule = activeIndices.map((i) => schedule[i] ?? []);

  const activeInitData = isEditMode ? editInitData : createInitData;
  // const activeSchedule = isEditMode ? schedule : createSchedule;
  const saveLoading = isEditMode ? saveEditLoading : saveCreateLoading;
  const title = isEditMode
    ? `${dayjs(detail?.date).format("YYYY년 MM월")} 스케줄 편집`
    : "스케줄 생성";

  return (
    <>
      <Flex flexDir={"column"} gap={4} p={4}>
        <PageHeader title={title} onBack={handleBack} />

        {!isEditMode && (
          <ScheduleHeader
            date={date}
            onDateChange={setDate}
            onInit={() => date && initSchedule()}
            initLoading={initLoading}
            initialized={!!initData}
          />
        )}

        {activeInitData && (
          <Flex flexDir={"column"} gap={3}>
            <Flex justify={"space-between"} align={"center"}>
              <WorkTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
              <Button
                icon={<FullscreenOutlined />}
                onClick={() => setFullscreen(true)}
                size="middle"
              />
            </Flex>
            <ScheduleTable
              initData={activeInitData}
              schedule={schedule}
              onCellClick={handleCellClick}
            />
            {isEditMode ? (
              <Flex justify={"flex-end"} mt={1}>
                <Button type="primary" loading={saveLoading} onClick={() => saveEdit()}>
                  저장
                </Button>
              </Flex>
            ) : (
              <ScheduleActionBar
                isGenerated={isGenerated}
                generateLoading={generateLoading}
                saveLoading={saveLoading}
                onGenerate={handleGenerate}
                onReset={handleReset}
                onSave={() => saveCreate()}
                onMemberSetting={() => setMemberModalOpen(true)}
              />
            )}
          </Flex>
        )}
      </Flex>

      <ScheduleMemberSettingModal
        open={memberModalOpen}
        members={memberConfigs}
        onChange={setMemberConfigs}
        onConfirm={() => setMemberModalOpen(false)}
      />

      {fullscreen && activeInitData && (
        <ScheduleFullscreenOverlay onClose={() => setFullscreen(false)}>
          <Flex justify={"space-between"} align={"center"} flexShrink={0}>
            <WorkTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
          </Flex>
          <ScheduleTable
            initData={activeInitData}
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
