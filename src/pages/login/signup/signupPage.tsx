import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const SignupPage = () => {
  return (
    <Flex flexDir={"column"}>
      회원가입 페이지
      <Link to={"/"}>메인 페이지</Link>
    </Flex>
  );
};

export default SignupPage;
