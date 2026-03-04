import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../api/axios";

const MypagePage = () => {
  /* 테스트용 START */
  // useEffect(() => {
  //   const data = api.get("/api/v1/user/list");
  //   console.log(data);
  // }, []);
  /* 테스트용 END */

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/api/v1/user/list");
      console.log(res.data);
    };

    fetchData();
  }, []);

  return (
    <Flex flexDir={"column"}>
      내정보 페이지
      <Link to={"/mypage/edit"}>내정보 수정페이지</Link>
    </Flex>
  );
};

export default MypagePage;
