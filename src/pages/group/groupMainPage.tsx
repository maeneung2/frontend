import { Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, List, Modal, Spin, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import GroupScheduleSection from "../../components/group/GroupScheduleSection";
import PageHeader from "../../components/common/PageHeader";

const { Text, Title } = Typography;

interface GroupData {
  groupId: string;
  groupName: string;
  groupProfile?: string;
  owner: string;
  members: { userId: string; userName: string; userProfile?: string }[];
}

interface NoticeItem {
  noticeId: string;
  title: string;
  createdAt: string;
}

interface NoteItem {
  noteId: string;
  content: string;
  date: string;
  createdAt: string;
}

const GroupMainPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["group-summary", group_id],
    queryFn: () =>
      api.get(`/api/v1/group/${group_id}/summary`).then((r) => r.data.data),
    enabled: !!group_id,
  });

  const group: GroupData | null = data?.group ?? null;
  const notices: NoticeItem[] = data?.notices ?? [];
  const notes: NoteItem[] = data?.notes ?? [];

  const { mutate: deleteGroup, isPending: deleteLoading } = useMutation({
    mutationFn: () => api.delete(`/api/v1/group/${group_id}`),
    onSuccess: () => navigate("/"),
  });

  const handleDelete = () => {
    Modal.confirm({
      title: "그룹 삭제",
      content: `'${group?.groupName}' 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: () => deleteGroup(),
    });
  };

  if (loading) return <Spin fullscreen />;
  if (!group) return <Flex>그룹을 찾을 수 없습니다.</Flex>;

  const isOwner = user?.id === group.owner;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader
        title={group.groupName}
        extra={
          <Flex gap={2}>
            <Button
              icon={<SettingOutlined />}
              type="text"
              onClick={() => navigate(`/group/${group_id}/setting`)}
            />
            {isOwner && (
              <Button danger size="small" loading={deleteLoading} onClick={handleDelete}>
                그룹 삭제
              </Button>
            )}
          </Flex>
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
        <List
          dataSource={notices}
          locale={{ emptyText: "등록된 공지사항이 없습니다." }}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/group/${group_id}/notice/${item.noticeId}`)}
              style={{ cursor: "pointer", padding: "10px 4px" }}
            >
              <Flex flexDir={"column"} gap={1} style={{ width: "100%" }}>
                <Text strong style={{ fontSize: 14 }}>
                  {item.title}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                </Text>
              </Flex>
            </List.Item>
          )}
        />
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
        <List
          dataSource={notes}
          locale={{ emptyText: "등록된 인수인계가 없습니다." }}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/group/${group_id}/note/${item.noteId}`)}
              style={{ cursor: "pointer", padding: "10px 4px" }}
            >
              <Flex flexDir={"column"} gap={1} style={{ width: "100%" }}>
                <Flex justify={"space-between"} align={"center"}>
                  <Text strong style={{ fontSize: 14 }}>
                    {dayjs(item.date).format("YYYY년 MM월 DD일")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.createdAt).format("MM-DD HH:mm")}
                  </Text>
                </Flex>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 13,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.content}
                </Text>
              </Flex>
            </List.Item>
          )}
        />
      </Flex>
    </Flex>
  );
};

export default GroupMainPage;