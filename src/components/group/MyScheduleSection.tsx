import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Drawer, Empty, List, Spin, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
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
  const [mySchedule, setMySchedule] = useState<number[]>([]);
  const [noteDays, setNoteDays] = useState<number[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [dateNotes, setDateNotes] = useState<NoteItem[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setScheduleLoading(true);
      setMySchedule([]);
      setNoteDays([]);
      try {
        const [listRes, noteRes] = await Promise.all([
          api.get("/api/v1/schedule", { params: { groupId } }),
          api.get("/api/v1/note/list", { params: { groupId } }),
        ]);

        const schedules: { scheduleId: string; date: string }[] = listRes.data.data;
        const matched = schedules.find((s) => dayjs(s.date).isSame(calendarDate, "month"));
        if (matched) {
          const meRes = await api.get(`/api/v1/schedule/${matched.scheduleId}/me`);
          setMySchedule(meRes.data.data.schedule ?? []);
        }

        const notes: { date: string }[] = noteRes.data.data ?? [];
        const days = notes
          .filter((n) => dayjs(n.date).isSame(calendarDate, "month"))
          .map((n) => dayjs(n.date).date() - 1);
        setNoteDays(days);
      } catch {
        // 조용히 처리
      } finally {
        setScheduleLoading(false);
      }
    };
    void fetch();
  }, [groupId, calendarDate]);

  const handleDayClick = async (day: Dayjs) => {
    setSelectedDate(day);
    setDateNotes([]);
    setNotesLoading(true);
    try {
      const res = await api.get("/api/v1/note/list/by-date", {
        params: { date: day.format("YYYY-MM-DD") },
      });
      setDateNotes(res.data.data ?? []);
    } catch {
      // 조용히 처리
    } finally {
      setNotesLoading(false);
    }
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
