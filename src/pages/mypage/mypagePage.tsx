import { useRef, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Avatar, Button, Divider, List, Modal, Switch, Typography } from "antd";
import { CameraOutlined, EditOutlined, LogoutOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { api } from "../../api/axios";
import { uploadImageToS3 } from "../../api/upload";
import PageHeader from "../../components/common/PageHeader";

const { Text, Title } = Typography;

const MypagePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const clear = useAuthStore((s) => s.clear);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const { preference, setPreference } = useThemeStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = preference === "dark";

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post("/api/v1/auth/logout", { refreshToken }),
    onSettled: () => {
      clear();
      navigate("/login");
    },
  });

  const handleLogout = () => {
    Modal.confirm({
      title: "로그아웃",
      content: "로그아웃 하시겠습니까?",
      okText: "로그아웃",
      cancelText: "취소",
      onOk: () => logout(),
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToS3(file, "profiles");
      const res = await api.patch(`/api/v1/user/${user?.userId}`, { userProfile: url });
      updateUser(res.data.data);
    } catch {
      // 조용히 처리
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="마이페이지" />
      {/* 프로필 */}
      <Flex flexDir={"column"} align={"center"} gap={3} py={4}>
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Avatar
            icon={!user?.userProfile ? <UserOutlined /> : undefined}
            src={user?.userProfile ?? undefined}
            size={72}
            style={{ opacity: uploading ? 0.5 : 1 }}
          />
          <Flex
            align={"center"}
            justify={"center"}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#1677ff",
              color: "#fff",
              fontSize: 11,
            }}
          >
            <CameraOutlined />
          </Flex>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <Flex flexDir={"column"} align={"center"} gap={1}>
          <Title level={4} style={{ margin: 0 }}>
            {user?.userName}
          </Title>
          <Text type="secondary">{user?.phone ?? "전화번호 없음"}</Text>
        </Flex>
        <Button icon={<EditOutlined />} size="small" onClick={() => navigate("/mypage/edit")} />
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