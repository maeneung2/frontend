import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const MypagePage = () => {
  return (
    <Flex flexDir={"column"}>
      내정보 페이지
      <Link to={"/mypage/edit"}>내정보 수정페이지</Link>
    </Flex>
  );
};

export default MypagePage;
