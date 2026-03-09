import { Flex } from "@chakra-ui/react";
import { List, Modal, Typography } from "antd";
import { CalendarOutlined, DeleteOutlined, RightOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import PageHeader from "../../../components/common/PageHeader";

const { Text } = Typography;

const MENU_ITEMS = [
  {
    key: "schedule",
    icon: <CalendarOutlined style={{ fontSize: 18 }} />,
    label: "스케줄 관리",
    desc: "월별 스케줄 생성 및 수정",
    path: (id: string) => `/group/${id}/setting/schedule`,
  },
  {
    key: "user",
    icon: <TeamOutlined style={{ fontSize: 18 }} />,
    label: "그룹원 관리",
    desc: "멤버 초대 및 권한 설정",
    path: (id: string) => `/group/${id}/setting/user`,
  },
];

const GroupSettingPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;

  const { data } = useQuery({
    queryKey: ["group-summary", group_id],
    queryFn: () => api.get(`/api/v1/group/${group_id}/summary`).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const groupName: string = data?.group?.groupName ?? "";
  const isOwner = user.userId === data?.group?.owner;

  const { mutate: deleteGroup, isPending: deleteLoading } = useMutation({
    mutationFn: () => api.delete(`/api/v1/group/${group_id}`),
    onSuccess: () => navigate("/"),
  });

  const handleDelete = () => {
    Modal.confirm({
      title: "그룹 삭제",
      content: `'${groupName}' 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: () => deleteGroup(),
    });
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="그룹 설정" />

      <List
        dataSource={MENU_ITEMS}
        renderItem={(item) => (
          <List.Item
            onClick={() => navigate(item.path(group_id!))}
            style={{ cursor: "pointer", padding: "14px 8px" }}
            extra={<RightOutlined style={{ color: "#bfbfbf" }} />}
          >
            <List.Item.Meta
              avatar={
                <Flex
                  align={"center"}
                  justify={"center"}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#f0f5ff",
                    color: "#1677ff",
                  }}
                >
                  {item.icon}
                </Flex>
              }
              title={<Text strong>{item.label}</Text>}
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.desc}
                </Text>
              }
            />
          </List.Item>
        )}
      />

      {isOwner && (
        <List>
          <List.Item
            onClick={deleteLoading ? undefined : handleDelete}
            style={{ cursor: "pointer", padding: "14px 8px" }}
            extra={<RightOutlined style={{ color: "#bfbfbf" }} />}
          >
            <List.Item.Meta
              avatar={
                <Flex
                  align={"center"}
                  justify={"center"}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#fff1f0",
                    color: "#ff4d4f",
                  }}
                >
                  <DeleteOutlined style={{ fontSize: 18 }} />
                </Flex>
              }
              title={<Text strong style={{ color: "#ff4d4f" }}>그룹 삭제</Text>}
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  그룹을 영구적으로 삭제합니다
                </Text>
              }
            />
          </List.Item>
        </List>
      )}
    </Flex>
  );
};

export default GroupSettingPage;
