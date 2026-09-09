import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Form, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import NoticeForm from "../../../components/notice/NoticeForm";
import PageHeader from "../../../components/common/PageHeader";

const NoticeWritePage = () => {
  const { group_id, notice_id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = !!notice_id;

  const { data: noticeData, isError, isLoading } = useQuery({
    queryKey: ["notice", group_id, notice_id],
    queryFn: () =>
      api.get(`/api/v1/notice/${group_id}/${notice_id}`).then((r) => r.data.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (noticeData) {
      form.setFieldsValue({ title: noticeData.title, content: noticeData.content });
    }
  }, [noticeData, form]);

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const { mutate: submitNotice, isPending: loading } = useMutation({
    mutationFn: (values: { title: string; content: string; images: string[] }) => {
      const { images, ...rest } = values;
      return isEdit
        ? api.patch(`/api/v1/notice/${group_id}/${notice_id}`, { ...rest, image: images })
        : api.post("/api/v1/notice", { groupId: group_id, ...rest, image: images });
    },
    onSuccess: () => navigate(`/group/${group_id}/notice`),
    onError: () => alert(isEdit ? "수정에 실패했습니다." : "작성에 실패했습니다."),
  });

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title={isEdit ? "공지사항 수정" : "공지사항 작성"} />
      {isEdit && isLoading ? (
        <Flex justify={"center"} p={8}><Spin /></Flex>
      ) : (
        <NoticeForm
          form={form}
          loading={loading}
          isEdit={isEdit}
          initialImages={noticeData?.image ?? []}
          onSubmit={submitNotice}
          onCancel={() => navigate(-1)}
        />
      )}
    </Flex>
  );
};

export default NoticeWritePage;