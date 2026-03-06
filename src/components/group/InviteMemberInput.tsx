import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Input, message } from "antd";
import { api } from "../../api/axios";

interface Props {
  groupId: string;
  onSuccess: () => void;
}

const InviteMemberInput = ({ groupId, onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post(`/api/v1/group/${groupId}/member`, { id: email.trim() });
      message.success("초대가 완료되었습니다.");
      setEmail("");
      onSuccess();
    } catch {
      message.error("초대에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default InviteMemberInput;