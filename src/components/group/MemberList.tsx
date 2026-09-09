import { Flex } from "@chakra-ui/react";
import { Avatar, Button, List, Popconfirm, Tag, Typography } from "antd";
import { UserOutlined, UserDeleteOutlined, SafetyOutlined, CrownOutlined } from "@ant-design/icons";
import type { User } from "../../types/user";

const { Text } = Typography;

interface Props {
  members: User[];
  owner: string;
  currentUserId?: string;
  loading: boolean;
  removingId: string | null;
  onRemove: (userId: string) => void;
  settingAdminId?: string | null;
  onSetAdmin?: (userId: string, admin: boolean) => void;
  transferringId?: string | null;
  onTransferOwner?: (userId: string) => void;
}

const MemberList = ({
  members,
  owner,
  currentUserId,
  loading,
  removingId,
  onRemove,
  settingAdminId,
  onSetAdmin,
  transferringId,
  onTransferOwner,
}: Props) => {
  const isCurrentUserOwner = currentUserId === owner;

  return (
    <List
      loading={loading}
      dataSource={members}
      locale={{ emptyText: "그룹원이 없습니다." }}
      renderItem={(member) => {
        const isMemberOwner = member.userId === owner;
        const actions: React.ReactNode[] = [];

        if (isCurrentUserOwner && !isMemberOwner) {
          actions.push(
            <Popconfirm
              key="transfer"
              title={`'${member.userName}'에게 소유자를 양도하시겠습니까?`}
              description="양도 후에는 소유자 권한을 잃게 됩니다."
              onConfirm={() => onTransferOwner?.(member.userId)}
              okText="양도"
              cancelText="취소"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                icon={<CrownOutlined />}
                loading={transferringId === member.userId}
              />
            </Popconfirm>
          );
          actions.push(
            <Popconfirm
              key="admin"
              title={
                member.admin
                  ? `'${member.userName}'의 관리자 권한을 해제하시겠습니까?`
                  : `'${member.userName}'을(를) 관리자로 설정하시겠습니까?`
              }
              onConfirm={() => onSetAdmin?.(member.userId, !member.admin)}
              okText="확인"
              cancelText="취소"
            >
              <Button
                size="small"
                icon={<SafetyOutlined />}
                type={member.admin ? "primary" : "default"}
                loading={settingAdminId === member.userId}
              />
            </Popconfirm>
          );
          actions.push(
            <Popconfirm
              key="remove"
              title={`'${member.userName}'을(를) 그룹에서 제거하시겠습니까?`}
              onConfirm={() => onRemove(member.userId)}
              okText="제거"
              cancelText="취소"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
                icon={<UserDeleteOutlined />}
                loading={removingId === member.userId}
              />
            </Popconfirm>
          );
        }

        return (
          <List.Item actions={actions}>
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
                  {isMemberOwner && <Tag color="gold">소유자</Tag>}
                  {member.admin && !isMemberOwner && <Tag color="blue">관리자</Tag>}
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
