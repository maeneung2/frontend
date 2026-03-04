import { Button, Flex } from "@chakra-ui/react";
import { Form, Input } from "antd";
import { useCallback } from "react";
import { api } from "../../../api/axios";

const SignupPage = () => {
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
        await api.post("/api/v1/auth", { id, userName, phone, password });
      } catch {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    },
    []
  );

  return (
    <Flex flexDir={"column"} p={4}>
      <Form onFinish={handleSignup}>
        회원가입 페이지
        <Form.Item noStyle name={"id"}>
          <Flex flexDir={"column"}>
            아이디
            <Input />
          </Flex>
        </Form.Item>
        <Form.Item noStyle name={"userName"}>
          <Flex flexDir={"column"}>
            이름
            <Input />
          </Flex>
        </Form.Item>
        <Form.Item noStyle name={"phone"}>
          <Flex flexDir={"column"}>
            핸드폰
            <Input />
          </Flex>
        </Form.Item>
        <Form.Item noStyle name={"password"}>
          <Flex flexDir={"column"}>
            비밀번호
            <Input type={"password"} />
          </Flex>
        </Form.Item>
        <Form.Item noStyle name={"passwordConfirm"}>
          <Flex flexDir={"column"}>
            비밀번호 확인
            <Input type={"password"} />
          </Flex>
        </Form.Item>
        <Button type={"submit"}>회원가입</Button>
      </Form>
    </Flex>
  );
};

export default SignupPage;
