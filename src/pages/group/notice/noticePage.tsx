import { Flex } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

const NoticePage = () => {
  const { group_id } = useParams();

  return (
    <Flex flexDir={"column"}>
      공지사항 페이지
      <Link to={`/group/${group_id}/notice/default_notice_id`}>공지사항 상세페이지</Link>
      <Link to={`/group/${group_id}/notice/write`}>공지사항 작성페이지</Link>
    </Flex>
  );
};

export default NoticePage;
