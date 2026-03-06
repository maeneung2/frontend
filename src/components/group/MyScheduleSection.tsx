import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Spin, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { api } from "../../api/axios";
import MyScheduleCalendar from "../schedule/MyScheduleCalendar";

const { Title, Text } = Typography;

interface Props {
  groupId: string;
}

const MyScheduleSection = ({ groupId }: Props) => {
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [mySchedule, setMySchedule] = useState<number[] | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setScheduleLoading(true);
      setMySchedule(null);
      try {
        const listRes = await api.get("/api/v1/schedule", {
          params: { groupId },
        });
        const schedules: { scheduleId: string; date: string }[] = listRes.data.data;
        const matched = schedules.find((s) => dayjs(s.date).isSame(calendarDate, "month"));
        if (!matched) return;

        const meRes = await api.get(`/api/v1/schedule/${matched.scheduleId}/me`);
        setMySchedule(meRes.data.data.schedule);
      } catch {
        // 스케줄 없는 달은 조용히 처리
      } finally {
        setScheduleLoading(false);
      }
    };
    void fetch();
  }, [groupId, calendarDate]);

  return (
    <Flex flexDir={"column"} gap={3}>
      <Flex justify={"space-between"} align={"center"}>
        <Title level={5} style={{ margin: 0 }}>
          내 스케줄
        </Title>
        <Flex align={"center"} gap={2}>
          <Button
            icon={<LeftOutlined />}
            size="small"
            type="text"
            onClick={() => setCalendarDate((d) => d.subtract(1, "month"))}
          />
          <Text style={{ fontWeight: 600, minWidth: 80, textAlign: "center" }}>
            {calendarDate.format("YYYY년 MM월")}
          </Text>
          <Button
            icon={<RightOutlined />}
            size="small"
            type="text"
            onClick={() => setCalendarDate((d) => d.add(1, "month"))}
          />
        </Flex>
      </Flex>

      {scheduleLoading ? (
        <Flex justify={"center"} p={6}>
          <Spin />
        </Flex>
      ) : mySchedule ? (
        <MyScheduleCalendar date={calendarDate} schedule={mySchedule} />
      ) : (
        <Flex justify={"center"} align={"center"} p={8} style={{ color: "#bfbfbf", fontSize: 14 }}>
          해당 월의 스케줄이 없습니다.
        </Flex>
      )}
    </Flex>
  );
};

export default MyScheduleSection;
