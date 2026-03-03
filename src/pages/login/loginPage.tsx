import { Link } from "react-router-dom";
import { Form, Input } from "antd";
import { Button, Flex } from "@chakra-ui/react";
import axios from "axios";

const LoginPage = () => {
  return (
    <Flex flexDir={"column"} p={4}>
      <Form
        onFinish={async ({ id, password }) => {
          const res = await axios.post("http://localhost:3000/api/v1/user/login", {
            id,
            password,
          });
          const token = res.data.accessToken;
          console.log("token", token);
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
