import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const GroupMainPage = () => (
  <Flex flexDir={"column"}>
    그룹 메인 페이지
    <Link to={"/group/default_group_id/notice"}>공지사항 페이지</Link>
    <Link to={"/group/default_group_id/note"}>인수인계 페이지</Link>
    <Link to={"/group/default_group_id/setting"}>그룹 설정 페이지</Link>
  </Flex>
);

export default GroupMainPage;
