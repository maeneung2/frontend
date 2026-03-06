import { Flex } from "@chakra-ui/react";
import { Typography } from "antd";
import { WORK_TYPES, type WorkType } from "./scheduleTypes";

const { Text } = Typography;

interface Props {
  selectedType: WorkType;
  onSelect: (type: WorkType) => void;
}

const WorkTypeSelector = ({ selectedType, onSelect }: Props) => (
  <Flex gap={2} align={"center"} wrap={"wrap"}>
    <Text strong>근무형태:</Text>
    {WORK_TYPES.map((wt) => {
      const isSelected = selectedType === wt.value;
      return (
        <div
          key={wt.value}
          onClick={() => onSelect(wt.value)}
          style={{
            padding: "4px 12px",
            border: `2px solid ${isSelected ? wt.color : "#d9d9d9"}`,
            borderRadius: 6,
            background: isSelected ? wt.bg : "#fafafa",
            color: isSelected ? wt.color : "#8c8c8c",
            fontWeight: isSelected ? 700 : 400,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {wt.label}
        </div>
      );
    })}
  </Flex>
);

export default WorkTypeSelector;
