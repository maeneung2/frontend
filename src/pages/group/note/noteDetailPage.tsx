import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Divider, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import DetailPageHeader from "../../../components/common/DetailPageHeader";

const { Paragraph } = Typography;

interface Note {
  noteId: string;
  content: string;
  date: string;
  writer: string;
  createdAt: string;
}

const NoteDetailPage = () => {
  const { group_id, note_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/note/${note_id}`);
        setNote(res.data.data);
      } catch {
        alert("인수인계를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [note_id, navigate]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/v1/note/${note_id}`);
      navigate(`/group/${group_id}/note`);
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify={"center"} align={"center"} p={8}>
        <Spin />
      </Flex>
    );
  }

  if (!note) return null;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <DetailPageHeader
        title={`${dayjs(note.date).format("YYYY년 MM월 DD일")} 인수인계`}
        subtitle={`작성일: ${dayjs(note.createdAt).format("YYYY-MM-DD HH:mm")}`}
        isOwner={user?.id === note.writer}
        editPath={`/group/${group_id}/note/${note_id}/edit`}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        confirmText="인수인계를 삭제하시겠습니까?"
      />

      <Divider style={{ margin: "4px 0" }} />

      <Paragraph style={{ whiteSpace: "pre-wrap", fontSize: 14, minHeight: 120 }}>
        {note.content}
      </Paragraph>
    </Flex>
  );
};

export default NoteDetailPage;