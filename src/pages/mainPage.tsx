import { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Switch, Modal, Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { api } from "../api/axios";

const IndexPage = () => {
  const clear = useAuthStore((s) => s.clear);
  const setLogin = useAuthStore((s) => s.setLogin);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { preference, setPreference } = useThemeStore();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const isDark = preference === "dark";

  const handleToggle = (checked: boolean) => {
    setPreference(checked ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout", { refreshToken });
    } finally {
      clear();
      navigate("/login");
    }
  };

  const handleCreateGroup = async (values: { groupName: string }) => {
    try {
      const res = await api.post("/api/v1/group", values);
      const groupId = res.data.data.groupId;
      const meRes = await api.get("/api/v1/user/me");
      const { accessToken, refreshToken: rt } = useAuthStore.getState();
      setLogin(accessToken!, rt!, meRes.data);
      form.resetFields();
      setOpen(false);
      navigate(`/group/${groupId}`);
    } catch {
      alert("그룹 생성에 실패했습니다.");
    }
  };

  return (
    <Flex flexDir={"column"}>
      메인 페이지
      <Switch
        checked={isDark}
        onChange={handleToggle}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
      />
      <Link to={"/mypage"}>내정보 페이지</Link>
      <Link to={"/alarm"}>알림 페이지</Link>
      {user?.groupId && <Link to={`/group/${user.groupId}`}>그룹 페이지</Link>}
      {user?.groupId && (
        <Link to={`/group/${user.groupId}/note/default_note_id`}>인수인계 페이지</Link>
      )}
      {!user?.groupId && <Button onClick={() => setOpen(true)}>그룹 추가</Button>}
      <Text cursor={"pointer"} onClick={handleLogout}>
        로그아웃
      </Text>
      <Modal
        title="그룹 생성"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="생성"
        cancelText="취소"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item
            name="groupName"
            label="그룹 이름"
            rules={[{ required: true, message: "그룹 이름을 입력해주세요." }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default IndexPage;
