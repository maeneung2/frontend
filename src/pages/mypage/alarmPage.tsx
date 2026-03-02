import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const AlarmPage = () => {
  return (
    <Flex flexDir={"column"}>
      알림 페이지
      <Link to={"/group/deafult_group_id/notice/notice_group_id"}>공지사항 상세페이지</Link>
      <Link to={"/group/deafult_group_id"}>그룹 메인</Link>
    </Flex>
  );
};

export default AlarmPage;
