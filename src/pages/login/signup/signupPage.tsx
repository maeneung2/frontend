import { Flex } from "@chakra-ui/react";
import { Form, Input, Button, Typography } from "antd";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore.ts";

const { Title, Text } = Typography;

const SignupPage = () => {
  const setLogin = useAuthStore((s) => s.setLogin);
  const navigate = useNavigate();

  const handleSignup = useCallback(
    async ({
      id,
      userName,
      phone,
      password,
      passwordConfirm,
    }: {
      id: string;
      userName: string;
      phone: string;
      password: string;
      passwordConfirm: string;
    }): Promise<void> => {
      if (password !== passwordConfirm) {
        alert("비밀번호 불일치");
        return;
      }
      try {
        const res = await api.post("/api/v1/auth", { id, userName, phone, password });
        const { accessToken, refreshToken, user } = res.data;
        setLogin(accessToken, refreshToken, user);
        navigate("/");
      } catch {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    },
    [setLogin, navigate]
  );

  return (
    <Flex flexDir={"column"} justify={"center"} minH={"100vh"} p={6} maxW={400} mx={"auto"}>
      {/* 헤더 */}
      <Flex flexDir={"column"} align={"center"} gap={2} mb={8}>
        <Title level={2} style={{ margin: 0 }}>
          회원가입
        </Title>
        <Text type="secondary">새 계정을 만드세요</Text>
      </Flex>

      {/* 회원가입 폼 */}
      <Form layout="vertical" onFinish={handleSignup}>
        <Form.Item
          label="아이디"
          name="id"
          rules={[{ required: true, message: "아이디를 입력해주세요." }]}
        >
          <Input size="large" placeholder="아이디" />
        </Form.Item>
        <Form.Item
          label="이름"
          name="userName"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input size="large" placeholder="이름" />
        </Form.Item>
        <Form.Item label="전화번호" name="phone">
          <Input size="large" placeholder="전화번호 (선택)" />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
        >
          <Input.Password size="large" placeholder="비밀번호" />
        </Form.Item>
        <Form.Item
          label="비밀번호 확인"
          name="passwordConfirm"
          rules={[{ required: true, message: "비밀번호를 다시 입력해주세요." }]}
        >
          <Input.Password size="large" placeholder="비밀번호 확인" />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block>
          회원가입
        </Button>
      </Form>

      {/* 로그인 링크 */}
      <Flex justify={"center"} gap={1} mt={6}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          이미 계정이 있으신가요?
        </Text>
        <Link to="/login">
          <Text style={{ fontSize: 14, color: "#1677ff" }}>로그인</Text>
        </Link>
      </Flex>
    </Flex>
  );
};

export default SignupPage;
