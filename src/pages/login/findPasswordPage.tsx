import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const FindPasswordPage = () => (
  <Flex flexDir={"column"}>
    비밀번호 찾기 페이지
    <Link to={"/login/find-id"}>아이디 찾기 페이지</Link>
    <Link to={"/login/reset-password"}>비밀번호 재설정 페이지</Link>
  </Flex>
);

export default FindPasswordPage;
