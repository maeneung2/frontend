import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/axios";
import ScheduleList, { type ScheduleItem } from "../../../components/schedule/ScheduleList";

const { Title } = Typography;

const GroupScheduleSettingPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/schedule", {
          params: { groupId: group_id },
        });
        setSchedules(res.data.data);
      } catch {
        alert("스케줄 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    void fetchSchedules();
  }, [group_id]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/v1/schedule/${id}`);
      setSchedules((prev) => prev.filter((s) => s.scheduleId !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Flex justify={"space-between"} align={"center"}>
        <Title level={4} style={{ margin: 0 }}>
          스케줄 관리
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/group/${group_id}/setting/schedule/create`)}
        >
          스케줄 생성
        </Button>
      </Flex>

      <ScheduleList
        groupId={group_id!}
        schedules={schedules}
        loading={loading}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
    </Flex>
  );
};

export default GroupScheduleSettingPage;
