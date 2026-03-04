import { Flex, Text } from "@chakra-ui/react";
import { Switch } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { api } from "../api/axios";

const IndexPage = () => {
  const clear = useAuthStore((s) => s.clear);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const navigate = useNavigate();
  const { preference, setPreference } = useThemeStore();

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
      <Link to={"/group/default_group_id"}>그룹 페이지</Link>
      <Link to={"/group/default_group_id/note/default_note_id"}>인수인계 페이지</Link>
      <Text cursor={"pointer"} onClick={handleLogout}>
        로그아웃
      </Text>
    </Flex>
  );
};

export default IndexPage;
