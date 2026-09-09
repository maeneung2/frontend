import { Flex } from "@chakra-ui/react";
import { Badge, Button, Empty, List, Spin, Typography } from "antd";
import { BellOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { Invite, NotificationItem } from "../../types/notification";
import { useAuthStore } from "../../store/authStore";
import type { User } from "../../types/user";
import PageHeader from "../../components/common/PageHeader";

const { Text } = Typography;

const QUERY_KEY = ["notifications"];

const AlarmPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  const { data: notifications = [], isLoading: loading } = useQuery<NotificationItem[]>({
    queryKey: QUERY_KEY,
    queryFn: () => api.get("/api/v1/notification/list").then((r) => r.data.data),
  });

  const { mutate: markRead } = useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/notification/${id}/read`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>(
        QUERY_KEY,
        (prev) => prev?.map((n) => (n.notificationId === id ? { ...n, read: true } : n)) ?? []
      );
    },
  });

  const { mutate: deleteNotif } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/notification/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>(
        QUERY_KEY,
        (prev) => prev?.filter((n) => n.notificationId !== id) ?? []
      );
    },
  });

  const handleClick = (item: NotificationItem) => {
    if (item.type === 1) return;
    if (!item.read) markRead(item.notificationId);
    if (item.url) navigate(item.url);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotif(id);
  };

  const {
    mutate: acceptInvite,
    isPending: isAccepting,
    variables: acceptingId,
  } = useMutation({
    mutationFn: (inviteId: string) =>
      api.patch(`/api/v1/invite/${inviteId}/accept`).then((r) => r.data.data as User | null),
    onSuccess: (user, inviteId) => {
      if (user?.userId) updateUser(user);
      queryClient.setQueryData<NotificationItem[]>(
        QUERY_KEY,
        (prev) =>
          prev?.map((n) =>
            (n.data as Invite)?.inviteId === inviteId ? { ...n, data: undefined } : n
          ) ?? []
      );
    },
  });

  const {
    mutate: rejectInvite,
    isPending: isRejecting,
    variables: rejectingId,
  } = useMutation({
    mutationFn: (inviteId: string) => api.patch(`/api/v1/invite/${inviteId}/reject`),
    onSuccess: (_, inviteId) => {
      queryClient.setQueryData<NotificationItem[]>(
        QUERY_KEY,
        (prev) =>
          prev?.map((n) =>
            (n.data as Invite)?.inviteId === inviteId ? { ...n, data: undefined } : n
          ) ?? []
      );
    },
  });

  const handleAccept = (item: NotificationItem) => {
    console.log("hello");
    const inviteId = (item.data as Invite)?.inviteId;
    if (!inviteId) return;
    if (!item.read) markRead(item.notificationId);
    acceptInvite(inviteId);
  };

  const handleReject = (item: NotificationItem) => {
    const inviteId = (item.data as Invite)?.inviteId;
    if (!inviteId) return;
    if (!item.read) markRead(item.notificationId);
    rejectInvite(inviteId);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader
        title="알림"
        extra={unreadCount > 0 ? <Badge count={unreadCount} size="small" /> : undefined}
      />

      {loading ? (
        <Flex justify={"center"} p={8}>
          <Spin />
        </Flex>
      ) : notifications.length === 0 ? (
        <Flex justify={"center"} align={"center"} p={8}>
          <Empty
            image={<BellOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />}
            imageStyle={{ height: 48 }}
            description="알림이 없습니다."
          />
        </Flex>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleClick(item)}
              style={{
                cursor: item.type === 1 || !item.url ? "default" : "pointer",
                padding: "12px 4px",
                background: item.read ? "transparent" : "#f0f5ff",
                borderRadius: 8,
                marginBottom: 4,
              }}
              extra={
                item.type !== 1 ? (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={(e) => handleDelete(e, item.notificationId)}
                  />
                ) : undefined
              }
            >
              <Flex flexDir={"column"} gap={1} style={{ paddingLeft: 8 }}>
                <Flex align={"center"} gap={2}>
                  {!item.read && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#1677ff",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Text style={{ fontSize: 14, fontWeight: item.read ? 400 : 600 }}>
                    {item.content}
                  </Text>
                </Flex>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(item.createdAt).format("MM월 DD일 HH:mm")}
                </Text>
                {item.type === 1 && (
                  <Flex gap={2} style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="small"
                      type="primary"
                      disabled={!(item.data as Invite)?.inviteId}
                      loading={isAccepting && acceptingId === (item.data as Invite)?.inviteId}
                      onClick={() => handleAccept(item)}
                    >
                      수락
                    </Button>
                    <Button
                      size="small"
                      danger
                      disabled={!(item.data as Invite)?.inviteId}
                      loading={isRejecting && rejectingId === (item.data as Invite)?.inviteId}
                      onClick={() => handleReject(item)}
                    >
                      거절
                    </Button>
                  </Flex>
                )}
              </Flex>
            </List.Item>
          )}
        />
      )}
    </Flex>
  );
};

export default AlarmPage;
