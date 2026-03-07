import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Drawer, Empty, List, Spin, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import MyScheduleCalendar from "../schedule/MyScheduleCalendar";

const { Title, Text } = Typography;

interface NoteItem {
  noteId: string;
  date: string;
  content: string;
  writer: string;
}

interface Props {
  groupId: string;
}

const MyScheduleSection = ({ groupId }: Props) => {
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ["my-schedule", groupId, calendarDate.format("YYYY-MM")],
    queryFn: async () => {
      const [listRes, noteRes] = await Promise.all([
        api.get("/api/v1/schedule", { params: { groupId } }),
        api.get("/api/v1/note/list", { params: { groupId } }),
      ]);

      const schedules: { scheduleId: string; date: string }[] = listRes.data.data;
      const matched = schedules.find((s) => dayjs(s.date).isSame(calendarDate, "month"));
      let mySchedule: number[] = [];
      if (matched) {
        const meRes = await api.get(`/api/v1/schedule/${matched.scheduleId}/me`);
        mySchedule = meRes.data.data.schedule ?? [];
      }

      const notes: { date: string }[] = noteRes.data.data ?? [];
      const noteDays = notes
        .filter((n) => dayjs(n.date).isSame(calendarDate, "month"))
        .map((n) => dayjs(n.date).date() - 1);

      return { mySchedule, noteDays };
    },
  });

  const mySchedule = scheduleData?.mySchedule ?? [];
  const noteDays = scheduleData?.noteDays ?? [];

  const { data: dateNotes = [], isLoading: notesLoading } = useQuery<NoteItem[]>({
    queryKey: ["notes-by-date", selectedDate?.format("YYYY-MM-DD")],
    queryFn: () =>
      api
        .get("/api/v1/note/list/by-date", {
          params: { date: selectedDate!.format("YYYY-MM-DD") },
        })
        .then((r) => r.data.data ?? []),
    enabled: !!selectedDate,
  });

  const handleDayClick = (day: Dayjs) => {
    setSelectedDate(day);
  };

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
      ) : (
        <MyScheduleCalendar
          date={calendarDate}
          schedule={mySchedule}
          noteDays={noteDays}
          onDayClick={handleDayClick}
        />
      )}

      <Drawer
        title={selectedDate ? `${selectedDate.format("MM월 DD일")} 인수인계` : "인수인계"}
        placement="bottom"
        height={360}
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
      >
        {notesLoading ? (
          <Flex justify={"center"} align={"center"} style={{ height: "100%" }}>
            <Spin />
          </Flex>
        ) : dateNotes.length === 0 ? (
          <Empty description="등록된 인수인계가 없습니다." />
        ) : (
          <List
            dataSource={dateNotes}
            renderItem={(note) => (
              <List.Item key={note.noteId}>
                <List.Item.Meta
                  description={
                    <Text style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{note.content}</Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </Flex>
  );
};

export default MyScheduleSection;