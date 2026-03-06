import { Flex } from "@chakra-ui/react";
import { Avatar, Button, Divider, List, Modal, Switch, Typography } from "antd";
import { EditOutlined, LogoutOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { api } from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";

const { Text, Title } = Typography;

const MypagePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const { preference, setPreference } = useThemeStore();

  const isDark = preference === "dark";

  const handleLogout = () => {
    Modal.confirm({
      title: "로그아웃",
      content: "로그아웃 하시겠습니까?",
      okText: "로그아웃",
      cancelText: "취소",
      onOk: async () => {
        try {
          await api.post("/api/v1/auth/logout", { refreshToken });
        } finally {
          clear();
          navigate("/login");
        }
      },
    });
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="마이페이지" />
      {/* 프로필 */}
      <Flex flexDir={"column"} align={"center"} gap={3} py={4}>
        <Avatar icon={<UserOutlined />} size={72} />
        <Flex flexDir={"column"} align={"center"} gap={1}>
          <Title level={4} style={{ margin: 0 }}>
            {user?.userName}
          </Title>
          <Text type="secondary">{user?.phone ?? "전화번호 없음"}</Text>
        </Flex>
        <Button icon={<EditOutlined />} size="small" onClick={() => navigate("/mypage/edit")}>
          프로필 수정
        </Button>
      </Flex>

      <Divider style={{ margin: 0 }} />

      {/* 설정 메뉴 */}
      <List>
        <List.Item>
          <Flex justify={"space-between"} align={"center"} style={{ width: "100%" }}>
            <Text>다크 모드</Text>
            <Switch
              checked={isDark}
              onChange={(checked) => setPreference(checked ? "dark" : "light")}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </Flex>
        </List.Item>
        <List.Item
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
          extra={<RightOutlined style={{ color: "#bfbfbf" }} />}
        >
          <Flex align={"center"} gap={2}>
            <LogoutOutlined style={{ color: "#ff4d4f" }} />
            <Text style={{ color: "#ff4d4f" }}>로그아웃</Text>
          </Flex>
        </List.Item>
      </List>
    </Flex>
  );
};

export default MypagePage;
