import { List, Typography } from "antd";
import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { NoteItem } from "../../types/note";

export type { NoteItem };

const { Text } = Typography;

interface Props {
  groupId: string;
  notes: NoteItem[];
  loading: boolean;
}

const NoteList = ({ groupId, notes, loading }: Props) => {
  const navigate = useNavigate();

  return (
    <List
      loading={loading}
      dataSource={notes}
      locale={{ emptyText: "등록된 인수인계가 없습니다." }}
      renderItem={(item) => (
        <List.Item
          onClick={() => navigate(`/group/${groupId}/note/${item.noteId}`)}
          style={{ cursor: "pointer", padding: "12px 4px" }}
        >
          <Flex flexDir={"column"} gap={1} style={{ width: "100%" }}>
            <Flex justify={"space-between"} align={"center"}>
              <Text strong style={{ fontSize: 14 }}>
                {dayjs(item.date).format("YYYY년 MM월 DD일")}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(item.createdAt).format("MM-DD HH:mm")}
              </Text>
            </Flex>
            <Text
              type="secondary"
              style={{ fontSize: 13, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
            >
              {item.content}
            </Text>
          </Flex>
        </List.Item>
      )}
    />
  );
};

export default NoteList;