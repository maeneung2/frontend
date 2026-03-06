import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/axios";
import NoteList, { type NoteItem } from "../../../components/note/NoteList";

const { Title } = Typography;

const NotePage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/note/list", {
          params: { groupId: group_id },
        });
        setNotes(res.data.data);
      } catch {
        alert("인수인계 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [group_id]);

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Flex justify={"space-between"} align={"center"}>
        <Title level={4} style={{ margin: 0 }}>
          인수인계
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/group/${group_id}/note/write`)}
        >
          작성
        </Button>
      </Flex>

      <NoteList groupId={group_id!} notes={notes} loading={loading} />
    </Flex>
  );
};

export default NotePage;