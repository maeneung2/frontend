import { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Switch } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { api } from "../api/axios";
import CreateGroupModal from "../components/group/CreateGroupModal";
import MyScheduleSection from "../components/group/MyScheduleSection";
import GroupSummarySection from "../components/group/GroupSummarySection";

const IndexPage = () => {
  const clear = useAuthStore((s) => s.clear);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { preference, setPreference } = useThemeStore();
  const [open, setOpen] = useState(false);

  const isDark = preference === "dark";

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout", { refreshToken });
    } finally {
      clear();
      navigate("/login");
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Flex justify={"space-between"} align={"center"}>
        <Switch
          checked={isDark}
          onChange={(checked) => setPreference(checked ? "dark" : "light")}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
        <Flex gap={4} align={"center"}>
          <Link to={"/mypage"}>내정보</Link>
          <Link to={"/alarm"}>알림</Link>
          {user?.groupId && <Link to={`/group/${user.groupId}`}>그룹</Link>}
          {!user?.groupId && <button onClick={() => setOpen(true)}>그룹 추가</button>}
          <Text cursor={"pointer"} onClick={handleLogout}>
            로그아웃
          </Text>
        </Flex>
      </Flex>

      {user?.groupId && <MyScheduleSection groupId={user.groupId} />}
      {user?.groupId && <GroupSummarySection groupId={user.groupId} />}

      <CreateGroupModal open={open} onClose={() => setOpen(false)} />
    </Flex>
  );
};

export default IndexPage;
