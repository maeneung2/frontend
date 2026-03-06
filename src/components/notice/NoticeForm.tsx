import { Button, Form, Input } from "antd";
import { Flex } from "@chakra-ui/react";
import type { FormInstance } from "antd";

const { TextArea } = Input;

interface Props {
  form: FormInstance;
  loading: boolean;
  isEdit: boolean;
  onSubmit: (values: { title: string; content: string }) => void;
  onCancel: () => void;
}

const NoticeForm = ({ form, loading, isEdit, onSubmit, onCancel }: Props) => (
  <Form form={form} layout="vertical" onFinish={onSubmit}>
    <Form.Item
      name="title"
      label="제목"
      rules={[{ required: true, message: "제목을 입력해주세요." }]}
    >
      <Input placeholder="제목을 입력하세요" />
    </Form.Item>
    <Form.Item
      name="content"
      label="내용"
      rules={[{ required: true, message: "내용을 입력해주세요." }]}
    >
      <TextArea rows={10} placeholder="내용을 입력하세요" />
    </Form.Item>
    <Flex gap={2} justify={"flex-end"}>
      <Button onClick={onCancel}>취소</Button>
      <Button type="primary" htmlType="submit" loading={loading}>
        {isEdit ? "수정" : "등록"}
      </Button>
    </Flex>
  </Form>
);

export default NoticeForm;