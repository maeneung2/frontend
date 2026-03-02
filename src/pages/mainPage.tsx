import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const IndexPage = () => {
  return (
    <Flex flexDir={"column"}>
      메인 페이지
      <Link to={"/mypage"}>내정보 페이지</Link>
      <Link to={"/alarm"}>알림 페이지</Link>
      <Link to={"/group/default_group_id"}>그룹 페이지</Link>
      <Link to={"/group/default_group_id/note/default_note_id"}>인수인계 페이지</Link>
    </Flex>
  );
};

export default IndexPage;
