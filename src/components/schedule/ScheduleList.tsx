import { Button, Popconfirm, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { ScheduleItem } from "../../types/schedule";

export type { ScheduleItem };

interface Props {
  groupId: string;
  schedules: ScheduleItem[];
  loading: boolean;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

const ScheduleList = ({ groupId, schedules, loading, deletingId, onDelete }: Props) => {
  const navigate = useNavigate();

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
          onConfirm={() => onDelete(record.scheduleId)}
          okText="삭제"
          cancelText="취소"
          okButtonProps={{ danger: true }}
          onPopupClick={(e) => e.stopPropagation()}
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={deletingId === record.scheduleId}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      dataSource={schedules}
      columns={columns}
      rowKey="scheduleId"
      loading={loading}
      pagination={false}
      locale={{ emptyText: "등록된 스케줄이 없습니다." }}
      onRow={(record) => ({
        onClick: () => navigate(`/group/${groupId}/setting/schedule/${record.scheduleId}`),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default ScheduleList;