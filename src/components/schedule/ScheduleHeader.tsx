import { Flex } from "@chakra-ui/react";
import { Button, DatePicker } from "antd";
import { Dayjs } from "dayjs";

interface Props {
  date: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  onInit: () => void;
  initLoading: boolean;
  initialized: boolean;
}

const ScheduleHeader = ({ date, onDateChange, onInit, initLoading, initialized }: Props) => (
  <Flex gap={2} align={"center"}>
    <DatePicker picker="month" value={date} onChange={onDateChange} placeholder="월 선택" disabled={initialized} />
    <Button onClick={onInit} loading={initLoading} disabled={!date || initialized}>
      불러오기
    </Button>
  </Flex>
);

export default ScheduleHeader;
