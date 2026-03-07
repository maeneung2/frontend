import { Form, Input, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateGroupModal = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();
  const setLogin = useAuthStore((s) => s.setLogin);
  const navigate = useNavigate();

  const { mutate: createGroup, isPending } = useMutation({
    mutationFn: async (values: { groupName: string }) => {
      const res = await api.post("/api/v1/group", values);
      const groupId = res.data.data.groupId;
      const meRes = await api.get("/api/v1/user/me");
      return { groupId, userData: meRes.data };
    },
    onSuccess: ({ groupId, userData }) => {
      const { accessToken, refreshToken } = useAuthStore.getState();
      setLogin(accessToken!, refreshToken!, userData);
      form.resetFields();
      onClose();
      navigate(`/group/${groupId}`);
    },
    onError: () => alert("그룹 생성에 실패했습니다."),
  });

  return (
    <Modal
      title="그룹 생성"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="생성"
      cancelText="취소"
      okButtonProps={{ loading: isPending }}
    >
      <Form form={form} layout="vertical" onFinish={createGroup}>
        <Form.Item
          name="groupName"
          label="그룹 이름"
          rules={[{ required: true, message: "그룹 이름을 입력해주세요." }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;