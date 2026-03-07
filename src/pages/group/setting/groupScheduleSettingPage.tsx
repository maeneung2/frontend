import { Flex } from "@chakra-ui/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import ScheduleList, { type ScheduleItem } from "../../../components/schedule/ScheduleList";
import PageHeader from "../../../components/common/PageHeader";

const GroupScheduleSettingPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryKey = ["schedules", group_id];

  const { data: schedules = [], isLoading: loading } = useQuery<ScheduleItem[]>({
    queryKey,
    queryFn: () =>
      api.get("/api/v1/schedule", { params: { groupId: group_id } }).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const { mutate: deleteSchedule, variables: deletingVar, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/schedule/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
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

      <ScheduleList
        groupId={group_id!}
        schedules={schedules}
        loading={loading}
        deletingId={deletingId}
        onDelete={deleteSchedule}
      />
    </Flex>
  );
};

export default GroupScheduleSettingPage;