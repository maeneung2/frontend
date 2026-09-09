import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/axios";

interface Props {
  groupId: string;
  onSuccess: () => void;
}

const InviteMemberInput = ({ groupId, onSuccess }: Props) => {
  const [email, setEmail] = useState("");

  const { mutate: invite, isPending: loading } = useMutation({
    mutationFn: () => api.post(`/api/v1/invite`, { groupId, id: email.trim() }),
    onSuccess: () => {
      message.success("초대가 완료되었습니다.");
      setEmail("");
      onSuccess();
    },
    onError: () => message.error("초대에 실패했습니다."),
  });

  const handleInvite = () => {
    if (!email.trim()) return;
    invite();
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
