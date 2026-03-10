import type { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface Props {
  title: string;
  avatar?: ReactNode;
  extra?: ReactNode;
  onBack?: () => void;
}

const PageHeader = ({ title, avatar, extra, onBack }: Props) => {
  const navigate = useNavigate();

  return (
    <Flex justify={"space-between"} align={"center"}>
      <Flex align={"center"} gap={2}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack ?? (() => navigate(-1))} />
        {avatar}
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
      </Flex>
      {extra}
    </Flex>
  );
};

export default PageHeader;