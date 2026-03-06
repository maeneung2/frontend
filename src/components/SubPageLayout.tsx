import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const SubPageLayout = () => {
  const navigate = useNavigate();

  return (
    <Flex flexDir={"column"}>
      <Flex align={"center"} p={2}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
        />
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default SubPageLayout;