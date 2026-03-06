import { useCallback, useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Divider, message } from "antd";
import { useParams } from "react-router-dom";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import InviteMemberInput from "../../../components/group/InviteMemberInput";
import MemberList, { type Member } from "../../../components/group/MemberList";
import PageHeader from "../../../components/common/PageHeader";

const GroupUserSettingPage = () => {
  const { group_id } = useParams();
  const user = useAuthStore((s) => s.user);
  const [members, setMembers] = useState<Member[]>([]);
  const [owner, setOwner] = useState<string>("");
  const [membersLoading, setMembersLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setMembersLoading(true);
    try {
      const res = await api.get(`/api/v1/group/${group_id}`);
      setMembers(res.data.data.members);
      setOwner(res.data.data.owner);
    } catch {
      message.error("그룹원 목록을 불러오는데 실패했습니다.");
    } finally {
      setMembersLoading(false);
    }
  }, [group_id]);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const handleRemove = async (userId: string) => {
    setRemovingId(userId);
    try {
      await api.delete(`/api/v1/group/${group_id}/member/${userId}`);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      message.success("그룹원을 제거했습니다.");
    } catch {
      message.error("그룹원 제거에 실패했습니다.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="그룹원 관리" />

      <InviteMemberInput groupId={group_id!} onSuccess={fetchMembers} />

      <Divider style={{ margin: "4px 0" }} />

      <MemberList
        members={members}
        owner={owner}
        currentUserId={user?.id}
        loading={membersLoading}
        removingId={removingId}
        onRemove={handleRemove}
      />
    </Flex>
  );
};

export default GroupUserSettingPage;