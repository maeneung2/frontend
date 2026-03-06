import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Input, Typography, message } from "antd";
import { useParams } from "react-router-dom";
import { api } from "../../../api/axios";

const { Title } = Typography;

const GroupUserSettingPage = () => {
  const { group_id } = useParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post(`/api/v1/group/${group_id}/member`, { id: email.trim() });
      message.success("초대가 완료되었습니다.");
      setEmail("");
    } catch {
      message.error("초대에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Title level={4}>그룹원 관리</Title>
      <Flex gap={2}>
        <Input
          placeholder="초대할 이메일(ID) 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onPressEnter={handleInvite}
          style={{ flex: 1 }}
        />
        <Button type="primary" onClick={handleInvite} loading={loading} disabled={!email.trim()}>
          초대
        </Button>
      </Flex>
    </Flex>
  );
};

export default GroupUserSettingPage;
