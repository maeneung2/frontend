import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/axios";
import NoteList, { type NoteItem } from "../../../components/note/NoteList";
import PageHeader from "../../../components/common/PageHeader";

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
      <PageHeader
        title="인수인계"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/group/${group_id}/note/write`)}>
            작성
          </Button>
        }
      />

      <NoteList groupId={group_id!} notes={notes} loading={loading} />
    </Flex>
  );
};

export default NotePage;