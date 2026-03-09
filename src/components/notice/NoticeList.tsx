import { List, Typography } from "antd";
import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { NoticeItem } from "../../types/notice";

export type { NoticeItem };

const { Text } = Typography;

interface Props {
  groupId: string;
  notices: NoticeItem[];
  loading: boolean;
}

const NoticeList = ({ groupId, notices, loading }: Props) => {
  const navigate = useNavigate();

  return (
    <List
      loading={loading}
      dataSource={notices}
      locale={{ emptyText: "등록된 공지사항이 없습니다." }}
      renderItem={(item) => (
        <List.Item
          onClick={() => navigate(`/group/${groupId}/notice/${item.noticeId}`)}
          style={{ cursor: "pointer", padding: "12px 4px" }}
        >
          <Flex flexDir={"column"} gap={1} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 14 }}>
              {item.title}
            </Text>
            <Flex justify={"space-between"}>
              <Text type={"secondary"} style={{ fontSize: 12 }}>
                {item.user.userName}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
              </Text>
            </Flex>
          </Flex>
        </List.Item>
      )}
    />
  );
};

export default NoticeList;
