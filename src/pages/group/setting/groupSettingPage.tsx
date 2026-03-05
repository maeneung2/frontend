import { Flex } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

const GroupSettingPage = () => {
  const { group_id } = useParams();

  return (
    <Flex flexDir={"column"}>
      그룹 세팅 페이지
      <Link to={`/group/${group_id}/setting/schedule`}>스케줄 관리 페이지</Link>
      <Link to={`/group/${group_id}/setting/user`}>그룹원 관리 페이지</Link>
    </Flex>
  );
};

export default GroupSettingPage;
