import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, Typography } from "antd";
import { Flex } from "@chakra-ui/react";
import { GoogleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/axios.ts";
import { useAuthStore } from "../../store/authStore.ts";

const { Title, Text } = Typography;

const SOCIAL_PROVIDERS = [
  { key: "google", label: "Google", icon: <GoogleOutlined /> },
  { key: "kakao", label: "Kakao" },
  { key: "naver", label: "Naver" },
] as const;

const LoginPage = () => {
  const setLogin = useAuthStore((s) => s.setLogin);
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      api.post("/api/v1/auth/login", { id, password }).then((r) => r.data),
    onSuccess: ({ accessToken, refreshToken, user }) => {
      setLogin(accessToken, refreshToken, user);
      navigate("/");
    },
    onError: () => {
      alert("아이디 또는 비밀번호를 확인해주세요.");
    },
  });

  const handleSocialLogin = (provider: string) => {
    window.location.assign(`${import.meta.env.VITE_API_URL}/oauth/${provider}`);
  };

  return (
    <Flex flexDir={"column"} justify={"center"} minH={"100vh"} p={6} maxW={400} mx={"auto"}>
      {/* 헤더 */}
      <Flex flexDir={"column"} align={"center"} gap={2} mb={8}>
        <Title level={2} style={{ margin: 0 }}>
          로그인
        </Title>
        <Text type="secondary">계정에 로그인하세요</Text>
      </Flex>

      {/* 로그인 폼 */}
      <Form layout="vertical" onFinish={(values) => login(values)}>
        <Form.Item
          label="아이디"
          name="id"
          rules={[{ required: true, message: "아이디를 입력해주세요." }]}
        >
          <Input size="large" placeholder="아이디" />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
        >
          <Input.Password size="large" placeholder="비밀번호" />
        </Form.Item>

        <Flex justify={"flex-end"} mb={4}>
          <Link to="/login/find-password">
            <Text type="secondary" style={{ fontSize: 13 }}>
              비밀번호 찾기
            </Text>
          </Link>
        </Flex>

        <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
          로그인
        </Button>
      </Form>

      {/* 소셜 로그인 */}
      <Divider plain style={{ color: "#bfbfbf", fontSize: 13 }}>
        소셜 로그인
      </Divider>
      <Flex flexDir={"column"} gap={2}>
        {SOCIAL_PROVIDERS.map(({ key, label }) => (
          <Button key={key} size="large" block onClick={() => handleSocialLogin(key)}>
            {label}로 로그인
          </Button>
        ))}
      </Flex>

      {/* 회원가입 링크 */}
      <Flex justify={"center"} gap={1} mt={6}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          계정이 없으신가요?
        </Text>
        <Link to="/login/sign-up">
          <Text style={{ fontSize: 14, color: "#1677ff" }}>회원가입</Text>
        </Link>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
