import { Button, DatePicker, Form, Input } from "antd";
import { Flex } from "@chakra-ui/react";
import type { FormInstance } from "antd";
import type { Dayjs } from "dayjs";

const { TextArea } = Input;

interface Props {
  form: FormInstance;
  loading: boolean;
  isEdit: boolean;
  onSubmit: (values: { date: Dayjs; content: string }) => void;
  onCancel: () => void;
}

const NoteForm = ({ form, loading, isEdit, onSubmit, onCancel }: Props) => (
  <Form form={form} layout="vertical" onFinish={onSubmit}>
    <Form.Item
      name="date"
      label="인수인계 날짜"
      rules={[{ required: true, message: "날짜를 선택해주세요." }]}
    >
      <DatePicker style={{ width: "100%" }} placeholder="날짜 선택" />
    </Form.Item>
    <Form.Item
      name="content"
      label="내용"
      rules={[{ required: true, message: "내용을 입력해주세요." }]}
    >
      <TextArea rows={10} placeholder="인수인계 내용을 입력하세요" />
    </Form.Item>
    <Flex gap={2} justify={"flex-end"}>
      <Button onClick={onCancel}>취소</Button>
      <Button type="primary" htmlType="submit" loading={loading}>
        {isEdit ? "수정" : "등록"}
      </Button>
    </Flex>
  </Form>
);

export default NoteForm;