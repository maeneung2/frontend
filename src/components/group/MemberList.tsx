import { Flex } from "@chakra-ui/react";
import { Avatar, Button, List, Popconfirm, Tag, Typography } from "antd";
import { UserOutlined, UserDeleteOutlined } from "@ant-design/icons";
import type { Member } from "../../types/group";

export type { Member };

const { Text } = Typography;

interface Props {
  members: Member[];
  owner: string;
  currentUserId?: string;
  loading: boolean;
  removingId: string | null;
  onRemove: (userId: string) => void;
}

const MemberList = ({ members, owner, currentUserId, loading, removingId, onRemove }: Props) => {
  const isCurrentUserOwner = currentUserId === owner;

  return (
    <List
      loading={loading}
      dataSource={members}
      locale={{ emptyText: "그룹원이 없습니다." }}
      renderItem={(member) => {
        const isMemberOwner = member.userId === owner;
        return (
          <List.Item
            actions={
              isCurrentUserOwner && !isMemberOwner
                ? [
                    <Popconfirm
                      key="remove"
                      title={`'${member.userName}'을(를) 그룹에서 제거하시겠습니까?`}
                      onConfirm={() => onRemove(member.userId)}
                      okText="제거"
                      cancelText="취소"
                      okButtonProps={{ danger: true }}
                    >
                      <Button size="small" danger icon={<UserDeleteOutlined />} loading={removingId === member.userId} />
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={member.userProfile ?? undefined}
                  icon={!member.userProfile ? <UserOutlined /> : undefined}
                />
              }
              title={
                <Flex align={"center"} gap={2}>
                  <Text>{member.userName}</Text>
                  {isMemberOwner && <Tag color="gold">관리자</Tag>}
                  {member.userId === currentUserId && !isMemberOwner && <Tag>나</Tag>}
                </Flex>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default MemberList;