import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import NoteForm from "../../../components/note/NoteForm";
import PageHeader from "../../../components/common/PageHeader";

const NoteWritePage = () => {
  const { group_id, note_id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = !!note_id;

  const { data: noteData, isError } = useQuery({
    queryKey: ["note", note_id],
    queryFn: () => api.get(`/api/v1/note/${note_id}`).then((r) => r.data.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (noteData) {
      form.setFieldsValue({ content: noteData.content, date: dayjs(noteData.date) });
    }
  }, [noteData, form]);

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const { mutate: submitNote, isPending: loading } = useMutation({
    mutationFn: (values: { content: string; date: Dayjs }) => {
      const payload = { content: values.content, date: values.date.toISOString() };
      return isEdit
        ? api.patch(`/api/v1/note/${note_id}`, payload)
        : api.post("/api/v1/note", { groupId: group_id, ...payload });
    },
    onSuccess: () => navigate(`/group/${group_id}/note`),
    onError: () => alert(isEdit ? "수정에 실패했습니다." : "작성에 실패했습니다."),
  });

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title={isEdit ? "인수인계 수정" : "인수인계 작성"} />
      <NoteForm
        form={form}
        loading={loading}
        isEdit={isEdit}
        onSubmit={submitNote}
        onCancel={() => navigate(-1)}
      />
    </Flex>
  );
};

export default NoteWritePage;