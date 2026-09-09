import { useState } from "react";
import { Button, Form, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Flex } from "@chakra-ui/react";
import type { FormInstance, UploadFile } from "antd";
import { uploadImageToS3 } from "../../api/upload";

const { TextArea } = Input;

interface Props {
  form: FormInstance;
  loading: boolean;
  isEdit: boolean;
  initialImages?: string[];
  onSubmit: (values: { title: string; content: string; images: string[] }) => void;
  onCancel: () => void;
}

const NoticeForm = ({ form, loading, isEdit, initialImages = [], onSubmit, onCancel }: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialImages.map((url, i) => ({
      uid: String(-i - 1),
      name: `image_${i + 1}`,
      status: "done" as const,
      url,
    }))
  );
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    const uid = String(Date.now());
    setFileList((prev) => [...prev, { uid, name: file.name, status: "uploading" }]);
    setUploading(true);
    try {
      const url = await uploadImageToS3(file, "notices");
      setFileList((prev) =>
        prev.map((f) => (f.uid === uid ? { ...f, status: "done" as const, url } : f))
      );
    } catch {
      setFileList((prev) =>
        prev.map((f) => (f.uid === uid ? { ...f, status: "error" as const } : f))
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = (values: { title: string; content: string }) => {
    const images = fileList
      .filter((f) => f.status === "done" && f.url)
      .map((f) => f.url!);
    onSubmit({ ...values, images });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
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
      <Form.Item label="이미지">
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={(file) => {
            void handleUpload(file);
            return false;
          }}
          onRemove={(file) => {
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
          }}
          accept="image/jpeg,image/png,image/webp,image/gif"
        >
          {fileList.length < 5 && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>업로드</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Flex gap={2} justify={"flex-end"}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit" loading={loading || uploading}>
          {isEdit ? "수정" : "등록"}
        </Button>
      </Flex>
    </Form>
  );
};

export default NoticeForm;