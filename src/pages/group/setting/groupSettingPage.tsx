import { Flex } from "@chakra-ui/react";
import { Avatar, List, Modal, Spin, Typography, Upload } from "antd";
import { CalendarOutlined, CameraOutlined, DeleteOutlined, RightOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import { uploadImageToS3 } from "../../../api/upload";
import PageHeader from "../../../components/common/PageHeader";
import type { ReactNode } from "react";

const { Text } = Typography;

interface MenuItem {
  key: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  labelColor?: string;
  desc: string;
  onClick: () => void;
}

const GroupSettingPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["group-summary", group_id],
    queryFn: () => api.get(`/api/v1/group/${group_id}/summary`).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const groupName: string = data?.group?.groupName ?? "";
  const groupProfile: string | null = data?.group?.groupProfile ?? null;
  const isOwner = user.userId === data?.group?.owner;

  const [uploading, setUploading] = useState(false);

  const handleProfileChange = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImageToS3(file, "profiles");
      await api.patch(`/api/v1/group/${group_id}`, { groupProfile: url });
      queryClient.invalidateQueries({ queryKey: ["group-summary", group_id] });
    } finally {
      setUploading(false);
    }
  };

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

  const menuItems: MenuItem[] = [
    {
      key: "schedule",
      icon: <CalendarOutlined style={{ fontSize: 18 }} />,
      iconBg: "#f0f5ff",
      iconColor: "#1677ff",
      label: "스케줄 관리",
      desc: "월별 스케줄 생성 및 수정",
      onClick: () => navigate(`/group/${group_id}/setting/schedule`),
    },
    {
      key: "user",
      icon: <TeamOutlined style={{ fontSize: 18 }} />,
      iconBg: "#f0f5ff",
      iconColor: "#1677ff",
      label: "그룹원 관리",
      desc: "멤버 초대 및 권한 설정",
      onClick: () => navigate(`/group/${group_id}/setting/user`),
    },
    ...(isOwner
      ? [
          {
            key: "delete",
            icon: <DeleteOutlined style={{ fontSize: 18 }} />,
            iconBg: "#fff1f0",
            iconColor: "#ff4d4f",
            label: "그룹 삭제",
            labelColor: "#ff4d4f",
            desc: "그룹을 영구적으로 삭제합니다",
            onClick: deleteLoading ? () => {} : handleDelete,
          },
        ]
      : []),
  ];

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="그룹 설정" />

      {isOwner && (
        <Flex justify={"center"} py={2}>
          <Upload
            showUploadList={false}
            accept="image/jpeg,image/png,image/webp"
            beforeUpload={(file) => {
              void handleProfileChange(file);
              return false;
            }}
          >
            <div style={{ position: "relative", cursor: "pointer" }}>
              <Avatar
                src={groupProfile ?? undefined}
                icon={!groupProfile ? <TeamOutlined /> : undefined}
                size={80}
              />
              <Flex
                align={"center"}
                justify={"center"}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.35)",
                }}
              >
                {uploading ? (
                  <Spin size="small" />
                ) : (
                  <CameraOutlined style={{ fontSize: 20, color: "#fff" }} />
                )}
              </Flex>
            </div>
          </Upload>
        </Flex>
      )}

      <List
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item
            onClick={item.onClick}
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
                    background: item.iconBg,
                    color: item.iconColor,
                  }}
                >
                  {item.icon}
                </Flex>
              }
              title={
                <Text strong style={item.labelColor ? { color: item.labelColor } : undefined}>
                  {item.label}
                </Text>
              }
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.desc}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Flex>
  );
};

export default GroupSettingPage;