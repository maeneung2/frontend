import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NoticePage = () => (
  <Flex flexDir={"column"}>
    공지사항 페이지
    <Link to={"/group/default_group_id/notice/default_notice_id"}>공지사항 상세페이지</Link>
    <Link to={"/group/default_group_id/notice/write"}>공지사항 작성페이지</Link>
  </Flex>
);

export default NoticePage;
