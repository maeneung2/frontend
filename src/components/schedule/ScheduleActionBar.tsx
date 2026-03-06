import { Flex } from "@chakra-ui/react";
import { Button } from "antd";

interface Props {
  isGenerated: boolean;
  generateLoading: boolean;
  saveLoading: boolean;
  onGenerate: () => void;
  onReset: () => void;
  onSave: () => void;
}

const ScheduleActionBar = ({
  isGenerated,
  generateLoading,
  saveLoading,
  onGenerate,
  onReset,
  onSave,
}: Props) => (
  <Flex gap={2} justify={"flex-end"} mt={1}>
    {isGenerated && (
      <Button onClick={onReset} danger>
        리셋
      </Button>
    )}
    <Button onClick={onGenerate} loading={generateLoading}>
      {isGenerated ? "재생성" : "시간표 생성"}
    </Button>
    <Button type="primary" onClick={onSave} loading={saveLoading}>
      저장
    </Button>
  </Flex>
);

export default ScheduleActionBar;
