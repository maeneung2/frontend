import { Flex } from "@chakra-ui/react";
import { Button } from "antd";

interface Props {
  isGenerated: boolean;
  isRotation: boolean;
  generateLoading: boolean;
  saveLoading: boolean;
  onGenerate: () => void;
  onReset: () => void;
  onSave: () => void;
  onMemberSetting: () => void;
}

const ScheduleActionBar = ({
  isGenerated,
  isRotation,
  generateLoading,
  saveLoading,
  onGenerate,
  onReset,
  onSave,
  onMemberSetting,
}: Props) => (
  <Flex gap={2} justify={"flex-end"} mt={1}>
    <Button onClick={onMemberSetting}>멤버 설정</Button>
    {!isRotation && (
      <>
        {isGenerated && (
          <Button onClick={onReset} danger>
            리셋
          </Button>
        )}
        <Button onClick={onGenerate} loading={generateLoading}>
          {isGenerated ? "재생성" : "시간표 생성"}
        </Button>
      </>
    )}
    <Button type="primary" onClick={onSave} loading={saveLoading}>
      저장
    </Button>
  </Flex>
);

export default ScheduleActionBar;
