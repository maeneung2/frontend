import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";

const MypageEditPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      userName: user?.userName,
      phone: user?.phone,
    });
  }, [user, form]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (values: { userName: string; phone: string }) =>
      api.patch(`/api/v1/user/${user?.userId}`, values).then((r) => r.data.data),
    onSuccess: (data) => {
      updateUser(data);
      navigate(-1);
    },
  });

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="프로필 수정" />

      <Form form={form} layout="vertical" onFinish={updateProfile}>
        <Form.Item
          label="이름"
          name="userName"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input placeholder="이름" />
        </Form.Item>
        <Form.Item label="전화번호" name="phone">
          <Input placeholder="전화번호" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending} block>
          저장
        </Button>
      </Form>
    </Flex>
  );
};

export default MypageEditPage;