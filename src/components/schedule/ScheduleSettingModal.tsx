import { Avatar, InputNumber, Modal, Segmented, Select, Tag, Typography } from "antd";
import { CheckSquareFilled, BorderOutlined, UserOutlined, CloseOutlined } from "@ant-design/icons";
import { Flex } from "@chakra-ui/react";
import type { MemberConfig, ShiftMode, WorkType, FixedShift } from "../../types/schedule.ts";
import { WORK_TYPES } from "../../types/schedule.ts";

const { Text } = Typography;

interface Props {
  open: boolean;
  members: MemberConfig[];
  shiftMode: ShiftMode;
  rotationPattern: WorkType[];
  onShiftModeChange: (mode: ShiftMode) => void;
  onRotationPatternChange: (pattern: WorkType[]) => void;
  onChange: (members: MemberConfig[]) => void;
  onConfirm: () => void;
}

const ScheduleSettingModal = ({
  open,
  members,
  shiftMode,
  rotationPattern,
  onShiftModeChange,
  onRotationPatternChange,
  onChange,
  onConfirm,
}: Props) => {
  const update = (userId: string, patch: Partial<MemberConfig>) => {
    onChange(members.map((m) => (m.userId === userId ? { ...m, ...patch } : m)));
  };

  const patternTypes = WORK_TYPES.filter(
    (wt) => wt.value !== 0 && (wt.shiftMode === shiftMode || wt.shiftMode === "공통")
  );

  const hasPattern = rotationPattern.length > 0;

  const addToPattern = (value: WorkType) => {
    onRotationPatternChange([...rotationPattern, value]);
  };

  const removeFromPattern = (idx: number) => {
    onRotationPatternChange(rotationPattern.filter((_, i) => i !== idx));
  };

  const handleShiftModeChange = (mode: ShiftMode) => {
    onShiftModeChange(mode);
    onRotationPatternChange([]);
  };

  return (
    <Modal
      title="스케줄 설정"
      open={open}
      onOk={onConfirm}
      okText="확인"
      okButtonProps={{ disabled: shiftMode === "3교대" && !hasPattern }}
      cancelButtonProps={{ style: { display: "none" } }}
      closable={false}
      maskClosable={false}
    >
      <Flex flexDir={"column"} gap={4} py={2}>
        {/* 교대 방식 */}
        <Flex flexDir={"column"} gap={2}>
          <Text strong>교대 방식</Text>
          <Segmented
            options={["2교대", "3교대"]}
            value={shiftMode}
            onChange={(v) => handleShiftModeChange(v as ShiftMode)}
            block
          />
        </Flex>

        {/* 순환 패턴 */}
        <Flex flexDir={"column"} gap={2}>
          <Flex align={"center"} gap={2}>
            <Text strong>순환 패턴</Text>
            {shiftMode === "3교대" && <Text type="danger" style={{ fontSize: 12 }}>필수</Text>}
            {shiftMode === "2교대" && <Text type="secondary" style={{ fontSize: 12 }}>없으면 랜덤 배치</Text>}
          </Flex>

          {/* 현재 패턴 */}
          <Flex gap={1} wrap={"wrap"} align={"center"} style={{ minHeight: 32 }}>
            {rotationPattern.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 12 }}>패턴을 추가하세요</Text>
            ) : (
              rotationPattern.map((v, idx) => {
                const wt = WORK_TYPES.find((w) => w.value === v)!;
                return (
                  <Tag
                    key={idx}
                    color={wt.color}
                    closeIcon={<CloseOutlined />}
                    onClose={() => removeFromPattern(idx)}
                    style={{ marginRight: 0 }}
                  >
                    {wt.short}
                  </Tag>
                );
              })
            )}
          </Flex>

          {/* 추가 버튼 */}
          <Flex gap={1} wrap={"wrap"}>
            {patternTypes.map((wt) => (
              <Tag
                key={wt.value}
                color={wt.color}
                style={{ cursor: "pointer", marginRight: 0 }}
                onClick={() => addToPattern(wt.value)}
              >
                + {wt.label}
              </Tag>
            ))}
            {rotationPattern.length > 0 && (
              <Tag
                style={{ cursor: "pointer", marginRight: 0 }}
                onClick={() => onRotationPatternChange([])}
              >
                초기화
              </Tag>
            )}
          </Flex>
        </Flex>

        {/* 멤버 설정 */}
        <Flex flexDir={"column"} gap={3}>
          <Text strong>멤버 설정</Text>
          {members.map((m) => (
            <Flex
              key={m.userId}
              flexDir={"column"}
              gap={1}
              style={{
                opacity: m.excluded ? 0.35 : 1,
                filter: m.excluded ? "grayscale(1)" : "none",
                transition: "opacity 0.2s, filter 0.2s",
              }}
            >
              {/* 윗줄: 유저 정보 */}
              <Flex align={"center"} gap={2}>
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
                  size={28}
                  style={{ flexShrink: 0 }}
                />
                <Text>{m.user.userName}</Text>
              </Flex>

              {/* 아랫줄: 설정 */}
              {(hasPattern || shiftMode === "2교대") && (
                <Flex align={"center"} gap={2} style={{ paddingLeft: 26 }}>
                  {hasPattern ? (
                    <Select
                      size="small"
                      value={m.rotationStart}
                      disabled={m.excluded}
                      onChange={(v) => update(m.userId, { rotationStart: v })}
                      style={{ flex: 1 }}
                      options={rotationPattern.map((v, idx) => {
                        const wt = WORK_TYPES.find((w) => w.value === v)!;
                        return { value: idx, label: `${idx + 1}. ${wt.label}` };
                      })}
                    />
                  ) : (
                    <>
                      <Select
                        size="small"
                        value={m.fixedShift}
                        disabled={m.excluded}
                        onChange={(v: FixedShift) => update(m.userId, { fixedShift: v })}
                        style={{ flex: 1 }}
                        options={[
                          { value: "none", label: "고정없음" },
                          { value: "day", label: "주간고정" },
                          { value: "night", label: "야간고정" },
                        ]}
                      />
                      <InputNumber
                        size="small"
                        min={0}
                        max={31}
                        value={m.restCount}
                        disabled={m.excluded}
                        onChange={(v) => update(m.userId, { restCount: v ?? 0 })}
                        style={{ width: 72 }}
                        suffix="휴"
                      />
                    </>
                  )}
                </Flex>
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Modal>
  );
};

export default ScheduleSettingModal;