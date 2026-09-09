import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Modal, Spin } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import type {
  InitData,
  WorkType,
  ScheduleDetail,
  MemberConfig,
  ShiftMode,
  FixedShift,
} from "../../../types/schedule.ts";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import WorkTypeSelector from "../../../components/schedule/WorkTypeSelector";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleActionBar from "../../../components/schedule/ScheduleActionBar";
import ScheduleFullscreenOverlay from "../../../components/schedule/ScheduleFullscreenOverlay";
import PageHeader from "../../../components/common/PageHeader";
import ScheduleSettingModal from "../../../components/schedule/ScheduleSettingModal";

const FIXED_SHIFT_MAP = { none: 0, day: 1, night: 2 } as const;
const FIXED_SHIFT_REVERSE: FixedShift[] = ["none", "day", "night"];

const REST_TYPES = new Set([0, 4, 5]);

function calcPrevMonthData(plan: number[]): { prevWorkCount: number; lastWorkType: WorkType } {
  const lastRestIdx = Math.max(plan.lastIndexOf(0), plan.lastIndexOf(4), plan.lastIndexOf(5));
  const prevWorkCount = lastRestIdx >= 0 ? plan.length - 1 - lastRestIdx : plan.length;
  let lastWorkType: WorkType = 0;
  for (let i = plan.length - 1; i >= 0; i--) {
    if (!REST_TYPES.has(plan[i])) { lastWorkType = plan[i] as WorkType; break; }
  }
  return { prevWorkCount, lastWorkType };
}

function inferRotationStart(plan: WorkType[], pattern: WorkType[]): number {
  const P = pattern.length;
  let bestStart = 0;
  let bestMatches = -1;
  for (let start = 0; start < P; start++) {
    let matches = 0;
    for (let i = 0; i < plan.length; i++) {
      if (plan[i] === pattern[(start + i) % P]) matches++;
    }
    if (matches > bestMatches) {
      bestMatches = matches;
      bestStart = start;
    }
  }
  return bestStart;
}

const GroupScheduleEditPage = () => {
  const { group_id, schedule_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!schedule_id;

  // 공통 상태
  const [schedule, setSchedule] = useState<number[][]>([]);
  const [selectedType, setSelectedType] = useState<WorkType>(1);
  const [fullscreen, setFullscreen] = useState(false);

  // 편집 모드 전용
  const [isDirty, setIsDirty] = useState(false);

  // 생성 모드 전용
  const initDateFromState = (location.state as { date?: string } | null)?.date;
  const [date, setDate] = useState<Dayjs | null>(
    initDateFromState ? dayjs(initDateFromState) : null
  );
  const [initData, setInitData] = useState<InitData | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberConfigs, setMemberConfigs] = useState<MemberConfig[]>([]);
  const [shiftMode, setShiftMode] = useState<ShiftMode>("2교대");
  const [rotationPattern, setRotationPattern] = useState<WorkType[]>([]);
  const [autoInitDone, setAutoInitDone] = useState(false);

  // 편집 모드: 기존 스케줄 로드
  const { data: detail, isLoading: detailLoading } = useQuery<ScheduleDetail>({
    queryKey: ["schedule-detail", schedule_id],
    queryFn: () => api.get(`/api/v1/schedule/${schedule_id}`).then((r) => r.data.data),
    enabled: isEditMode,
  });

  // 생성 모드: 이전 달 순환패턴 조회
  const prevDate = date ? date.subtract(1, "month") : null;
  const { data: scheduleList, isSuccess: scheduleListLoaded } = useQuery<Array<{ scheduleId: string; date: string }>>({
    queryKey: ["schedule-list", group_id],
    queryFn: () =>
      api.get("/api/v1/schedule", { params: { groupId: group_id } }).then((r) => r.data.data),
    enabled: !isEditMode && !!group_id,
  });
  const prevMonthScheduleId = scheduleList?.find((s) =>
    s.date.startsWith(prevDate?.format("YYYY-MM") ?? "___")
  )?.scheduleId;
  const { data: prevSchedule, isSuccess: prevScheduleLoaded } = useQuery<ScheduleDetail>({
    queryKey: ["schedule-detail", prevMonthScheduleId],
    queryFn: () => api.get(`/api/v1/schedule/${prevMonthScheduleId}`).then((r) => r.data.data),
    enabled: !!prevMonthScheduleId,
  });

  useEffect(() => {
    if (detail) {
      setSchedule(detail.workers.map((w) => [...w.plan]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setInitData(raw);
      setSchedule(raw.workers.map((w) => w.plan));

      const pattern = prevSchedule?.pattern;
      if (pattern && pattern.length > 0) {
        setRotationPattern(pattern);
        setMemberConfigs(
          raw.workers.map((w) => {
            const prevWorker = prevSchedule!.workers.find((pw) => pw.userId === w.userId);
            if (!prevWorker) {
              return { excluded: true, rotationStart: 0, fixedShift: "none" as const, ...w };
            }
            const inferredStart = inferRotationStart(prevWorker.plan as WorkType[], pattern);
            const rotationStart = (inferredStart + prevWorker.plan.length) % pattern.length;
            const fixedShift = FIXED_SHIFT_REVERSE[prevWorker.fixedWorkType] ?? "none";
            const { prevWorkCount, lastWorkType } = calcPrevMonthData(prevWorker.plan);
            return { excluded: false, rotationStart, fixedShift, ...w, prevWorkCount, lastWorkType };
          })
        );
      } else {
        setMemberConfigs(
          raw.workers.map((w) => {
            const prevWorker = prevSchedule?.workers.find((pw) => pw.userId === w.userId);
            const { prevWorkCount, lastWorkType } = prevWorker
              ? calcPrevMonthData(prevWorker.plan)
              : { prevWorkCount: 0, lastWorkType: 0 as WorkType };
            return {
              excluded: prevSchedule ? !prevWorker : false,
              rotationStart: 0,
              fixedShift: FIXED_SHIFT_REVERSE[prevWorker?.fixedWorkType ?? 0] ?? "none",
              ...w,
              prevWorkCount,
              lastWorkType,
            };
          })
        );
      }
      setMemberModalOpen(true);
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) alert("해당 월의 스케줄이 이미 존재합니다.");
      else alert("초기 데이터 로드에 실패했습니다.");
    },
  });

  // 다음달 버튼으로 진입 시 자동 init (prevSchedule 로드 완료 후 실행)
  useEffect(() => {
    if (!initDateFromState || isEditMode || autoInitDone) return;
    if (!scheduleListLoaded) return;
    if (prevMonthScheduleId && !prevScheduleLoaded) return;
    setAutoInitDone(true);
    initSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initDateFromState, isEditMode, autoInitDone, scheduleListLoaded, prevMonthScheduleId, prevScheduleLoaded]);

  const { mutate: generateSchedule, isPending: generateLoading } = useMutation({
    mutationFn: async () => {
      const activeRawWorkers = memberConfigs
        .filter((w) => !w.excluded)
        .map((w, idx) => ({
          ...w,
          plan: schedule[idx],
          fixedWorkType: FIXED_SHIFT_MAP[w.fixedShift],
        }));

      const r = await api.post("/api/v1/schedule/preview", {
        groupId: group_id,
        date: date!.format("YYYY-MM-01"),
        selectedDay: [],
        selectedNight: [],
        workers: activeRawWorkers,
      });
      return r.data.data;
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
        .map((w, idx) => ({
          ...w,
          plan: schedule[idx],
          fixedWorkType: FIXED_SHIFT_MAP[w.fixedShift],
        }));
      return api.post("/api/v1/schedule", {
        groupId: group_id,
        date: date!.format("YYYY-MM-01"),
        selectedDay: [],
        selectedNight: [],
        pattern: rotationPattern,
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
      if (next[originalIdx][dayIdx] === selectedType) {
        next[originalIdx][dayIdx] = 0;
        if (
          selectedType === 2 &&
          dayIdx + 1 < next[originalIdx].length &&
          next[originalIdx][dayIdx + 1] === 3
        ) {
          next[originalIdx][dayIdx + 1] = 0;
        }
        return next;
      }
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

    // 순환 패턴이 있으면 프론트에서 직접 생성
    if (rotationPattern.length > 0) {
      const generated = memberConfigs
        .filter((m) => !m.excluded)
        .map((m) =>
          Array.from(
            { length: initData.numDays },
            (_, i) => rotationPattern[(m.rotationStart + i) % rotationPattern.length]
          )
        );
      setSchedule(generated);
      setIsGenerated(true);
      return;
    }

    // 랜덤 배치: 백엔드 preview 호출
    const key = getDraftKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      setSchedule(JSON.parse(saved));
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

  // 생성 모드: 제외 멤버 필터링
  const activeIndices = memberConfigs.map((m, i) => (!m.excluded ? i : -1)).filter((i) => i !== -1);

  const createInitData: InitData | null = initData
    ? { ...initData, workers: memberConfigs.filter((m) => !m.excluded) }
    : null;

  const activeInitData = isEditMode ? editInitData : createInitData;
  const saveLoading = isEditMode ? saveEditLoading : saveCreateLoading;

  // 편집 모드 로딩
  if (isEditMode && detailLoading) {
    return (
      <Flex justify={"center"} align={"center"} p={8}>
        <Spin />
      </Flex>
    );
  }
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
              <WorkTypeSelector
                selectedType={selectedType}
                onSelect={setSelectedType}
                shiftMode={isEditMode ? "2교대" : shiftMode}
              />
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
                isRotation={rotationPattern.length > 0}
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

      <ScheduleSettingModal
        open={memberModalOpen}
        members={memberConfigs}
        shiftMode={shiftMode}
        rotationPattern={rotationPattern}
        onShiftModeChange={setShiftMode}
        onRotationPatternChange={setRotationPattern}
        onChange={setMemberConfigs}
        onConfirm={() => {
          setMemberModalOpen(false);
          if (rotationPattern.length > 0) handleGenerate();
        }}
      />

      {fullscreen && activeInitData && (
        <ScheduleFullscreenOverlay onClose={() => setFullscreen(false)}>
          <Flex justify={"space-between"} align={"center"} flexShrink={0}>
            <WorkTypeSelector
              selectedType={selectedType}
              onSelect={setSelectedType}
              shiftMode={isEditMode ? "2교대" : shiftMode}
            />
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
