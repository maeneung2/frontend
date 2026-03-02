import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const NotePage = () => {
  return (
    <Flex flexDir={"column"}>
      인수인계 페이지
      <Link to={"/group/default_group_id/note/default_note_id"}>인수인계 상세페이지</Link>
      <Link to={"/group/default_group_id/note/write"}>인수인계 작성페이지</Link>
    </Flex>
  );
};

export default NotePage;
