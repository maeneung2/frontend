import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Form, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { api } from "../../../api/axios";
import NoteForm from "../../../components/note/NoteForm";

const { Title } = Typography;

const NoteWritePage = () => {
  const { group_id, note_id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!note_id;

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/api/v1/note/${note_id}`);
        const { content, date } = res.data.data;
        form.setFieldsValue({ content, date: dayjs(date) });
      } catch {
        alert("인수인계를 불러오는데 실패했습니다.");
        navigate(-1);
      }
    };
    void fetch();
  }, [note_id, isEdit, form, navigate]);

  const handleSubmit = async (values: { content: string; date: Dayjs }) => {
    setLoading(true);
    try {
      const payload = { content: values.content, date: values.date.toISOString() };
      if (isEdit) {
        await api.patch(`/api/v1/note/${note_id}`, payload);
      } else {
        await api.post("/api/v1/note", { groupId: group_id, ...payload });
      }
      navigate(`/group/${group_id}/note`);
    } catch {
      alert(isEdit ? "수정에 실패했습니다." : "작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Title level={4} style={{ margin: 0 }}>
        {isEdit ? "인수인계 수정" : "인수인계 작성"}
      </Title>
      <NoteForm
        form={form}
        loading={loading}
        isEdit={isEdit}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </Flex>
  );
};

export default NoteWritePage;