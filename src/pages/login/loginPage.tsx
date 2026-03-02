import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const LoginPage = () => {
  return (
    <Flex flexDir={"column"}>
      로그인 페이지
      <Link to={"/login/find-password"}>비밀번호 찾기 페이지</Link>
      <Link to={"/login/sign-up"}>회원가입 페이지</Link>
      <Link to={"/"}>메인 페이지</Link>
    </Flex>
  );
};

export default LoginPage;
