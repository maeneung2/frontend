import { Button, Flex } from "@chakra-ui/react";
import { Form, Input } from "antd";
import axios from "axios";
import { useCallback } from "react";

const SignupPage = () => {
  const handleSignup = useCallback(
    async ({
      userName,
      phone,
      password,
      passwordConfirm,
    }: {
      userName: string;
      phone: string;
      password: string;
      passwordConfirm: string;
    }) => {
      if (password !== passwordConfirm) {
        alert("비밀번호 불일치");
        return;
      }
      const res = await axios.post("http://localhost:3000/api/v1/auth", {
        userName,
        phone,
        password,
      });
      const token = res.data.accessToken;
      console.log("token", token);
    },
    []
  );

  return (
    <Flex flexDir={"column"} p={4}>
      <Form onFinish={handleSignup}>
        회원가입 페이지
        <Form.Item noStyle name={"userName"}>
          <Flex flexDir={"column"}>
            아이디
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
