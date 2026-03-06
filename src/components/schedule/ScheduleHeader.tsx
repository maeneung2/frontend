import { Flex } from "@chakra-ui/react";
import { Button, DatePicker } from "antd";
import { Dayjs } from "dayjs";

interface Props {
  date: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  onInit: () => void;
  initLoading: boolean;
}

const ScheduleHeader = ({ date, onDateChange, onInit, initLoading }: Props) => (
  <Flex gap={2} align={"center"}>
    <DatePicker picker="month" value={date} onChange={onDateChange} placeholder="월 선택" />
    <Button onClick={onInit} loading={initLoading} disabled={!date}>
      불러오기
    </Button>
  </Flex>
);

export default ScheduleHeader;
