import { Flex } from "@chakra-ui/react";
import { Button, Popconfirm, Typography } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface Props {
  title: string;
  subtitle: string;
  isOwner: boolean;
  editPath: string;
  onDelete: () => void;
  deleteLoading: boolean;
  confirmText: string;
}

const DetailPageHeader = ({
  title,
  subtitle,
  isOwner,
  editPath,
  onDelete,
  deleteLoading,
  confirmText,
}: Props) => {
  const navigate = useNavigate();

  return (
    <Flex justify={"space-between"} align={"flex-start"}>
      <Flex align={"center"} gap={2} style={{ flex: 1 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
        <Flex flexDir={"column"} gap={1}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {subtitle}
          </Text>
        </Flex>
      </Flex>
      {isOwner && (
        <Flex gap={1} flexShrink={0}>
          <Button icon={<EditOutlined />} size="small" onClick={() => navigate(editPath)}>
            수정
          </Button>
          <Popconfirm
            title={confirmText}
            onConfirm={onDelete}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} size="small" danger loading={deleteLoading}>
              삭제
            </Button>
          </Popconfirm>
        </Flex>
      )}
    </Flex>
  );
};

export default DetailPageHeader;