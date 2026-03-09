import { Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Spin, Typography } from "antd";
import { SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import type { GroupData } from "../../types/group";
import type { NoticeItem } from "../../types/notice";
import type { NoteItem } from "../../types/note";
import GroupScheduleSection from "../../components/group/GroupScheduleSection";
import NoteList from "../../components/note/NoteList";
import NoticeList from "../../components/notice/NoticeList";
import PageHeader from "../../components/common/PageHeader";

const { Title } = Typography;

const GroupMainPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;

  const { data, isLoading: loading } = useQuery({
    queryKey: ["group-summary", group_id],
    queryFn: () => api.get(`/api/v1/group/${group_id}/summary`).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const group: GroupData | null = data?.group ?? null;
  const notices: NoticeItem[] = data?.notices ?? [];
  const notes: NoteItem[] = data?.notes ?? [];

  if (loading) return <Spin fullscreen />;
  if (!group) return <Flex>그룹을 찾을 수 없습니다.</Flex>;

  const canAccessSettings = user.userId === group.owner || user.admin;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader
        title={group.groupName}
        avatar={
          <Avatar
            src={group.groupProfile ?? undefined}
            icon={!group.groupProfile ? <TeamOutlined /> : undefined}
            size={32}
          />
        }
        extra={
          canAccessSettings && (
            <Button
              icon={<SettingOutlined />}
              type="text"
              onClick={() => navigate(`/group/${group_id}/setting`)}
            />
          )
        }
      />

      <GroupScheduleSection groupId={group_id!} />

      {/* 공지사항 */}
      <Flex flexDir={"column"} gap={1}>
        <Flex justify={"space-between"} align={"center"}>
          <Title level={5} style={{ margin: 0 }}>
            공지사항
          </Title>
          <Button type="link" size="small" onClick={() => navigate(`/group/${group_id}/notice`)}>
            더보기
          </Button>
        </Flex>
        <NoticeList groupId={group_id!} notices={notices} loading={false} />
      </Flex>

      {/* 인수인계 */}
      <Flex flexDir={"column"} gap={1}>
        <Flex justify={"space-between"} align={"center"}>
          <Title level={5} style={{ margin: 0 }}>
            인수인계
          </Title>
          <Button type="link" size="small" onClick={() => navigate(`/group/${group_id}/note`)}>
            더보기
          </Button>
        </Flex>
        <NoteList groupId={group_id!} notes={notes} loading={false} />
      </Flex>
    </Flex>
  );
};

export default GroupMainPage;
