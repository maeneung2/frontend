import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Badge, Button, Empty, List, Spin, Typography } from "antd";
import { BellOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";

const { Text } = Typography;

interface NotificationItem {
  notificationId: string;
  type: string;
  content: string;
  url: string | null;
  read: boolean;
  createdAt: string;
}

const AlarmPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("/api/v1/notification/list")
        .then((res) => setNotifications(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    void fetchData();
  }, []);

  const handleClick = async (item: NotificationItem) => {
    if (!item.read) {
      await api.patch(`/api/v1/notification/${item.notificationId}/read`).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === item.notificationId ? { ...n, read: true } : n))
      );
    }
    if (item.url) navigate(item.url);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await api.delete(`/api/v1/notification/${id}`).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="알림" extra={unreadCount > 0 ? <Badge count={unreadCount} size="small" /> : undefined} />

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
                cursor: item.url ? "pointer" : "default",
                padding: "12px 4px",
                background: item.read ? "transparent" : "#f0f5ff",
                borderRadius: 8,
                marginBottom: 4,
              }}
              extra={
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={(e) => handleDelete(e, item.notificationId)}
                />
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
              </Flex>
            </List.Item>
          )}
        />
      )}
    </Flex>
  );
};

export default AlarmPage;