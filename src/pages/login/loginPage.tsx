import { Link, useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { Button, Flex } from "@chakra-ui/react";
import { api } from "../../api/axios.ts";
import { useAuthStore } from "../../store/authStore.ts";

const SOCIAL_PROVIDERS = [
  { key: "google", label: "Google" },
  { key: "kakao", label: "Kakao" },
  { key: "naver", label: "Naver" },
  // { key: "apple", label: "Apple" },
] as const;

const LoginPage = () => {
  const setLogin = useAuthStore((s) => s.setLogin);
  const navigate = useNavigate();

  const handleSocialLogin = (provider: string) => {
    window.location.assign(`${import.meta.env.VITE_API_URL}/oauth/${provider}`);
  };

  return (
    <Form
      onFinish={async ({ id, password }) => {
        try {
          const res = await api.post("/api/v1/auth/login", { id, password });
          const { accessToken, refreshToken, user } = res.data;
          setLogin(accessToken, refreshToken, user);
          navigate("/");
        } catch {
          alert("아이디 또는 비밀번호를 확인해주세요.");
        }
      }}
    >
      <Flex flexDir={"column"} p={4}>
        로그인 페이지
        <Link to={"/login/find-password"}>비밀번호 찾기 페이지</Link>
        <Link to={"/login/sign-up"}>회원가입 페이지</Link>
        <Form.Item noStyle name={"id"}>
          <Flex flexDir={"column"}>
            아이디
            <Input variant={"outlined"} />
          </Flex>
        </Form.Item>
        <Form.Item noStyle name={"password"}>
          <Flex flexDir={"column"}>
            비밀번호
            <Input variant={"outlined"} type={"password"} />
          </Flex>
        </Form.Item>
        <Button type={"submit"}>로그인</Button>
        <Flex flexDir={"column"} gap={2} mt={4}>
          {SOCIAL_PROVIDERS.map(({ key, label }) => (
            <Button key={key} onClick={() => handleSocialLogin(key)}>
              {label}로 로그인
            </Button>
          ))}
        </Flex>
      </Flex>
    </Form>
  );
};

export default LoginPage;
