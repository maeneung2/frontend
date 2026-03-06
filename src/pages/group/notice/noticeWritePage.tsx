import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Form, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/axios";
import NoticeForm from "../../../components/notice/NoticeForm";

const { Title } = Typography;

const NoticeWritePage = () => {
  const { group_id, notice_id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!notice_id;

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/api/v1/notice/${group_id}/${notice_id}`);
        const { title, content } = res.data.data;
        form.setFieldsValue({ title, content });
      } catch {
        alert("공지사항을 불러오는데 실패했습니다.");
        navigate(-1);
      }
    };
    void fetch();
  }, [group_id, notice_id, isEdit, form, navigate]);

  const handleSubmit = async (values: { title: string; content: string }) => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.patch(`/api/v1/notice/${group_id}/${notice_id}`, values);
      } else {
        await api.post("/api/v1/notice", { groupId: group_id, ...values });
      }
      navigate(`/group/${group_id}/notice`);
    } catch {
      alert(isEdit ? "수정에 실패했습니다." : "작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Title level={4} style={{ margin: 0 }}>
        {isEdit ? "공지사항 수정" : "공지사항 작성"}
      </Title>
      <NoticeForm
        form={form}
        loading={loading}
        isEdit={isEdit}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </Flex>
  );
};

export default NoticeWritePage;