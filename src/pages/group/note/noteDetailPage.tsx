import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Divider, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/authStore";
import { api } from "../../../api/axios";
import type { Note } from "../../../types/note";
import DetailPageHeader from "../../../components/common/DetailPageHeader";

const { Paragraph } = Typography;

const NoteDetailPage = () => {
  const { group_id, note_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;

  const {
    data: note,
    isLoading: loading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", note_id],
    queryFn: () => api.get(`/api/v1/note/${note_id}`).then((r) => r.data.data),
    enabled: !!note_id,
  });

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const { mutate: deleteNote, isPending: deleteLoading } = useMutation({
    mutationFn: () => api.delete(`/api/v1/note/${note_id}`),
    onSuccess: () => navigate(`/group/${group_id}/note`),
    onError: () => alert("삭제에 실패했습니다."),
  });

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
        subtitle={`${note.user?.userName ?? ""} · ${dayjs(note.createdAt).format("YYYY-MM-DD HH:mm")}`}
        isOwner={user.userId === note.writer}
        editPath={`/group/${group_id}/note/${note_id}/edit`}
        onDelete={() => deleteNote()}
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
