import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Popconfirm, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../../api/axios";

const { Title } = Typography;

interface ScheduleItem {
  scheduleId: string;
  date: string;
  createdAt: string;
}

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

  const columns = [
    {
      title: "날짜",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("YYYY년 MM월"),
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_: unknown, record: ScheduleItem) => (
        <Popconfirm
          title="스케줄을 삭제하시겠습니까?"
          onConfirm={() => handleDelete(record.scheduleId)}
          okText="삭제"
          cancelText="취소"
          okButtonProps={{ danger: true }}
          onPopupClick={(e) => e.stopPropagation()}
        >
          <Button
            danger
            size="small"
            loading={deletingId === record.scheduleId}
            onClick={(e) => e.stopPropagation()}
          >
            삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];

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

      <Table
        dataSource={schedules}
        columns={columns}
        rowKey="scheduleId"
        loading={loading}
        pagination={false}
        locale={{ emptyText: "등록된 스케줄이 없습니다." }}
        onRow={(record) => ({
          onClick: () => navigate(`/group/${group_id}/setting/schedule/${record.scheduleId}`),
          style: { cursor: "pointer" },
        })}
      />
    </Flex>
  );
};

export default GroupScheduleSettingPage;
