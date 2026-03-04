import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Flex flexDir={"column"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
      <Text fontSize={"xl"}>404</Text>
      <Text>페이지를 찾을 수 없습니다.</Text>
      <Link to={"/"}>홈으로</Link>
    </Flex>
  );
};

export default NotFoundPage;