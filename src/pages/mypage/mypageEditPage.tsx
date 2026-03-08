import { useEffect, useRef, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Avatar, Button, Form, Input } from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../api/axios";
import { uploadImageToS3 } from "../../api/upload";
import PageHeader from "../../components/common/PageHeader";

const MypageEditPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setLogin = useAuthStore((s) => s.setLogin);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const [form] = Form.useForm();
  const [profileUrl, setProfileUrl] = useState<string | null>(
    (user as { userProfile?: string | null })?.userProfile ?? null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    form.setFieldsValue({
      userName: user?.userName,
      phone: user?.phone,
    });
  }, [user, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToS3(file, "profiles");
      setProfileUrl(url);
    } catch {
      // 조용히 처리
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (values: { userName: string; phone: string }) =>
      api
        .patch(`/api/v1/user/${user?.id}`, { ...values, userProfile: profileUrl })
        .then((r) => r.data.data),
    onSuccess: (data) => {
      setLogin(accessToken!, refreshToken!, { ...user!, ...data });
      navigate(-1);
    },
  });

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="프로필 수정" />

      <Flex flexDir={"column"} align={"center"} py={4}>
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Avatar
            icon={!profileUrl ? <UserOutlined /> : undefined}
            src={profileUrl ?? undefined}
            size={72}
            style={{ opacity: uploading ? 0.5 : 1 }}
          />
          <Flex
            align={"center"}
            justify={"center"}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#1677ff",
              color: "#fff",
              fontSize: 11,
            }}
          >
            <CameraOutlined />
          </Flex>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </Flex>

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
        <Button type="primary" htmlType="submit" loading={isPending || uploading} block>
          저장
        </Button>
      </Form>
    </Flex>
  );
};

export default MypageEditPage;