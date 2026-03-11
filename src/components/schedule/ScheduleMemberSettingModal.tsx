import { Avatar, InputNumber, Modal, Switch, Typography } from "antd";
import { CheckSquareFilled, BorderOutlined, UserOutlined } from "@ant-design/icons";
import { Flex } from "@chakra-ui/react";
import type { MemberConfig } from "../../types/schedule.ts";

const { Text } = Typography;

interface Props {
  open: boolean;
  members: MemberConfig[];
  onChange: (members: MemberConfig[]) => void;
  onConfirm: () => void;
}

const ScheduleMemberSettingModal = ({ open, members, onChange, onConfirm }: Props) => {
  const update = (userId: string, patch: Partial<MemberConfig>) => {
    onChange(members.map((m) => (m.userId === userId ? { ...m, ...patch } : m)));
  };

  return (
    <Modal
      title="멤버 설정"
      open={open}
      onOk={onConfirm}
      okText="확인"
      cancelButtonProps={{ style: { display: "none" } }}
      closable={false}
      maskClosable={false}
    >
      <Flex flexDir={"column"} gap={3} py={2}>
        {members.map((m) => (
          <Flex
            key={m.userId}
            align={"center"}
            gap={3}
            style={{
              opacity: m.excluded ? 0.35 : 1,
              filter: m.excluded ? "grayscale(1)" : "none",
              transition: "opacity 0.2s, filter 0.2s",
            }}
          >
            {m.excluded ? (
              <BorderOutlined
                style={{ fontSize: 18, color: "#bfbfbf", cursor: "pointer", flexShrink: 0 }}
                onClick={() => update(m.userId, { excluded: false })}
              />
            ) : (
              <CheckSquareFilled
                style={{ fontSize: 18, color: "#1677ff", cursor: "pointer", flexShrink: 0 }}
                onClick={() => update(m.userId, { excluded: true })}
              />
            )}

            <Avatar
              src={m.user.userProfile ?? undefined}
              icon={!m.user.userProfile ? <UserOutlined /> : undefined}
              size={32}
              style={{ flexShrink: 0 }}
            />
            <Text style={{ flex: 1 }}>{m.user.userName}</Text>

            <Flex align={"center"} gap={1}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                주간
              </Text>
              <Switch
                size="small"
                checked={m.isNight}
                disabled={m.excluded}
                onChange={(v) => update(m.userId, { isNight: v })}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                야간
              </Text>
            </Flex>

            <InputNumber
              size="small"
              min={0}
              max={31}
              value={m.restCount}
              disabled={m.excluded}
              onChange={(v) => update(m.userId, { restCount: v ?? 0 })}
              style={{ width: 58 }}
              suffix="휴"
            />
          </Flex>
        ))}
      </Flex>
    </Modal>
  );
};

export default ScheduleMemberSettingModal;
