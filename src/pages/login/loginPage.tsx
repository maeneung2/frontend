import { Link, useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { Button, Flex } from "@chakra-ui/react";
import { api } from "../../api/axios.ts";
import { useAuthStore } from "../../store/authStore.ts";

const LoginPage = () => {
  const setLogin = useAuthStore((s) => s.setLogin);
  const navigate = useNavigate();

  return (
    <Flex flexDir={"column"} p={4}>
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
        로그인 페이지
        <Link to={"/login/find-password"}>비밀번호 찾기 페이지</Link>
        <Link to={"/login/sign-up"}>회원가입 페이지</Link>
        <Form.Item noStyle name={"id"}>
          <Flex flexDir={"column"}>
            아이디
            <Input />
          </Flex>
        </Form.Item>
        <Form.Item noStyle name={"password"}>
          <Flex flexDir={"column"}>
            비밀번호
            <Input type={"password"} />
          </Flex>
        </Form.Item>
        <Button type={"submit"}>로그인</Button>
      </Form>
    </Flex>
  );
};

export default LoginPage;
