import { Flex } from "@chakra-ui/react";
import { Button, Switch, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import ScheduleList from "../../../components/schedule/ScheduleList";
import PageHeader from "../../../components/common/PageHeader";
import type { ScheduleDetail } from "../../../types/schedule.ts";
import type { GroupData } from "../../../types/group.ts";

const { Text } = Typography;

const GroupScheduleSettingPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  const queryKey = ["schedules", group_id];
  const { data: groupData, isLoading: groupLoading } = useQuery<GroupData>({
    queryKey: ["group", group_id],
    queryFn: () => api.get(`/api/v1/group/${group_id}`).then((r) => r.data.data),
    enabled: !!group_id,
  });
  const isOwner = groupData?.owner === useAuthStore.getState().user?.userId;
  const { mutate: updatePolicy, isPending: policyUpdating } = useMutation({
    mutationFn: (restBlocksNextDayDay: boolean) =>
      api.patch(`/api/v1/group/${group_id}`, { restBlocksNextDayDay }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["group", group_id] }),
    onError: () => alert("팀 근무 규칙 저장에 실패했습니다."),
  });

  const { data: schedules = [], isLoading: loading } = useQuery<ScheduleDetail[]>({
    queryKey,
    queryFn: () =>
      api.get("/api/v1/schedule", { params: { groupId: group_id } }).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const {
    mutate: deleteSchedule,
    variables: deletingVar,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/schedule/${id}`).then((r) => r.data.data),
    onSuccess: (data) => {
      if (data?.user) updateUser(data.user);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => alert("삭제에 실패했습니다."),
  });

  const deletingId = isDeleting ? (deletingVar ?? null) : null;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader
        title="스케줄 관리"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/group/${group_id}/setting/schedule/create`)}
          >
            스케줄 생성
          </Button>
        }
      />

      {isOwner && !groupLoading && (
        <Flex justify="space-between" align="center" p={3} border="1px solid #f0f0f0" borderRadius="8px">
          <Flex flexDir="column" gap={1}>
            <Text strong>비번 다음 날 주간 배정 금지</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>새로 생성하는 초안에 적용되며, 확정본에도 당시 설정이 보존됩니다.</Text>
          </Flex>
          <Switch
            checked={groupData?.restBlocksNextDayDay ?? true}
            loading={policyUpdating}
            onChange={(checked) => updatePolicy(checked)}
          />
        </Flex>
      )}

      <ScheduleList
        groupId={group_id!}
        schedules={schedules}
        loading={loading}
        deletingId={deletingId}
        onDelete={deleteSchedule}
        onCreateNext={(scheduleId) => {
          const target = schedules.find((s) => s.scheduleId === scheduleId);
          if (!target) return;
          const nextDate = dayjs(target.date).add(1, "month").format("YYYY-MM-01");
          navigate(`/group/${group_id}/setting/schedule/create`, { state: { date: nextDate } });
        }}
      />
    </Flex>
  );
};

export default GroupScheduleSettingPage;
