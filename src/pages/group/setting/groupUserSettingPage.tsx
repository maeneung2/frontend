import { Flex } from "@chakra-ui/react";
import { Divider, message } from "antd";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import InviteMemberInput from "../../../components/group/InviteMemberInput";
import MemberList from "../../../components/group/MemberList";
import PageHeader from "../../../components/common/PageHeader";
import type { User } from "../../../types/user.ts";

const GroupUserSettingPage = () => {
  const { group_id } = useParams();
  const user = useAuthStore((s) => s.user)!;
  const queryClient = useQueryClient();

  const queryKey = ["group-members", group_id];

  const { data, isLoading: membersLoading } = useQuery({
    queryKey,
    queryFn: () => api.get(`/api/v1/group/${group_id}`).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const members: User[] = data?.members ?? [];
  const owner: string = data?.owner ?? "";

  const {
    mutate: removeMember,
    variables: removingVar,
    isPending: isRemoving,
  } = useMutation({
    mutationFn: (userId: string) => api.delete(`/api/v1/group/${group_id}/member/${userId}`),
    onSuccess: (_, userId) => {
      queryClient.setQueryData<{ members: User[]; owner: string }>(queryKey, (prev) =>
        prev ? { ...prev, members: prev.members.filter((m) => m.userId !== userId) } : prev
      );
      message.success("그룹원을 제거했습니다.");
    },
    onError: () => message.error("그룹원 제거에 실패했습니다."),
  });
  const removingId = isRemoving ? (removingVar ?? null) : null;

  const {
    mutate: setAdmin,
    variables: adminVar,
    isPending: isSettingAdmin,
  } = useMutation({
    mutationFn: ({ userId, admin }: { userId: string; admin: boolean }) =>
      api.patch(`/api/v1/user/${userId}/admin`, { admin }),
    onSuccess: (_, { userId, admin }) => {
      queryClient.setQueryData<{ members: User[]; owner: string }>(queryKey, (prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.map((m) => (m.userId === userId ? { ...m, admin } : m)),
            }
          : prev
      );
      message.success(admin ? "관리자로 설정했습니다." : "관리자 권한을 해제했습니다.");
    },
    onError: () => message.error("관리자 설정에 실패했습니다."),
  });
  const settingAdminId = isSettingAdmin ? (adminVar?.userId ?? null) : null;

  const {
    mutate: transferOwner,
    variables: transferVar,
    isPending: isTransferring,
  } = useMutation({
    mutationFn: (userId: string) => api.patch(`/api/v1/group/${group_id}/owner`, { userId }),
    onSuccess: (_, userId) => {
      queryClient.setQueryData<{ members: User[]; owner: string }>(queryKey, (prev) =>
        prev ? { ...prev, owner: userId } : prev
      );
      message.success("소유자를 양도했습니다.");
    },
    onError: () => message.error("소유자 양도에 실패했습니다."),
  });
  const transferringId = isTransferring ? (transferVar ?? null) : null;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="그룹원 관리" />

      <InviteMemberInput
        groupId={group_id!}
        onSuccess={() => queryClient.invalidateQueries({ queryKey })}
      />

      <Divider style={{ margin: "4px 0" }} />

      <MemberList
        members={members}
        owner={owner}
        currentUserId={user.userId}
        loading={membersLoading}
        removingId={removingId}
        onRemove={removeMember}
        settingAdminId={settingAdminId}
        onSetAdmin={(userId, admin) => setAdmin({ userId, admin })}
        transferringId={transferringId}
        onTransferOwner={transferOwner}
      />
    </Flex>
  );
};

export default GroupUserSettingPage;
