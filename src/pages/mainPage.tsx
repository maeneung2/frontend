import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Avatar, Badge, Button, Drawer, Empty, List, Tag, Typography } from "antd";
import { BellOutlined, LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/axios";
import type { MainData } from "../types/main";
import type { NoteDateItem } from "../types/note";
import CreateGroupModal from "../components/group/CreateGroupModal";
import MyScheduleCalendar from "../components/schedule/MyScheduleCalendar";
import { WORK_TYPES } from "../components/schedule/scheduleTypes";

const { Title, Text: AntText } = Typography;

const IndexPage = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const { data: mainData } = useQuery<MainData>({
    queryKey: ["main", user?.groupId],
    queryFn: () =>
      api
        .get("/api/v1/main", { params: { date: dayjs().format("YYYY-MM-DD") } })
        .then((r) => r.data.data),
    enabled: !!user?.groupId,
  });

  const { data: calendarData, isLoading: calendarLoading } = useQuery({
    queryKey: ["main-schedule", user?.groupId, calendarDate.format("YYYY-MM")],
    queryFn: () =>
      api
        .get("/api/v1/main/schedule", { params: { date: calendarDate.format("YYYY-MM-DD") } })
        .then((r) => r.data.data),
    enabled: !!user?.groupId,
  });

  const calendarSchedule: number[] = calendarData?.schedule ?? [];
  const noteDays: number[] = calendarData?.noteDays ?? [];

  const { data: dateNotes = [], isLoading: notesLoading } = useQuery<NoteDateItem[]>({
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
    <Flex flexDir={"column"} gap={4} p={4}>
      <Flex justify={"space-between"} align={"center"}>
        <Link to={"/mypage"}>
          <Flex align={"center"} gap={2}>
            <Avatar icon={<UserOutlined />} size={36} />
            <AntText strong style={{ fontSize: 15 }}>
              {user?.userName}
            </AntText>
          </Flex>
        </Link>
        <Flex align={"center"} gap={2}>
          {!user?.groupId && <button onClick={() => setOpen(true)}>그룹 추가</button>}
          <Link to={"/alarm"}>
            <Badge dot>
              <Button shape="circle" icon={<BellOutlined />} />
            </Badge>
          </Link>
        </Flex>
      </Flex>

      {user?.groupId && (
        <>
          {/* 내 스케줄 */}
          <Flex flexDir={"column"} gap={3}>
            <Flex justify={"space-between"} align={"center"}>
              <Flex align={"center"} gap={2}>
                <Title level={5} style={{ margin: 0 }}>
                  내 스케줄
                </Title>
                <Link to={`/group/${user.groupId}`}>
                  <AntText type="secondary" style={{ fontSize: 12 }}>
                    그룹 바로가기 →
                  </AntText>
                </Link>
              </Flex>
              <Flex align={"center"} gap={2}>
                <Button
                  icon={<LeftOutlined />}
                  size="small"
                  type="text"
                  onClick={() => setCalendarDate((d) => d.subtract(1, "month"))}
                />
                <AntText style={{ fontWeight: 600, minWidth: 80, textAlign: "center" }}>
                  {calendarDate.format("YYYY년 MM월")}
                </AntText>
                <Button
                  icon={<RightOutlined />}
                  size="small"
                  type="text"
                  onClick={() => setCalendarDate((d) => d.add(1, "month"))}
                />
              </Flex>
            </Flex>
            {calendarLoading ? (
              <Flex justify={"center"} p={6}>
                <AntText type="secondary">불러오는 중...</AntText>
              </Flex>
            ) : (
              <MyScheduleCalendar
                date={calendarDate}
                schedule={calendarSchedule}
                noteDays={noteDays}
                onDayClick={handleDayClick}
              />
            )}
          </Flex>

          {/* 오늘 근무자 */}
          <Flex flexDir={"column"} gap={2}>
            <Flex align={"baseline"} gap={2}>
              <Title level={5} style={{ margin: 0 }}>
                오늘 근무자
              </Title>
              <AntText type="secondary" style={{ fontSize: 12 }}>
                {dayjs().format("MM월 DD일 (ddd)")}
              </AntText>
            </Flex>
            {(() => {
              const groups = [
                { workType: 1, users: mainData?.todayWorkers.day ?? [] },
                { workType: 2, users: mainData?.todayWorkers.night ?? [] },
              ].filter((g) => g.users.length > 0);
              return groups.length === 0 ? (
                <Flex
                  justify={"center"}
                  align={"center"}
                  p={5}
                  style={{ color: "#bfbfbf", fontSize: 14 }}
                >
                  오늘 스케줄이 없습니다.
                </Flex>
              ) : (
                <Flex flexDir={"column"} gap={2}>
                  {groups.map(({ workType, users }) => {
                    const wt = WORK_TYPES.find((w) => w.value === workType)!;
                    return (
                      <Flex key={workType} align={"center"} gap={2} wrap={"wrap"}>
                        <Tag
                          color={wt.color}
                          style={{ minWidth: 36, textAlign: "center", margin: 0 }}
                        >
                          {wt.short}
                        </Tag>
                        <Flex gap={1} wrap={"wrap"}>
                          {users.map((u) => (
                            <Tag key={u.userId} style={{ margin: 0 }}>
                              {u.userName}
                            </Tag>
                          ))}
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
              );
            })()}
          </Flex>

          {/* 오늘 인수인계 */}
          <Flex flexDir={"column"} gap={2}>
            <Title level={5} style={{ margin: 0 }}>
              오늘 인수인계
            </Title>
            {!mainData || mainData.todayNotes.length === 0 ? (
              <Flex
                justify={"center"}
                align={"center"}
                p={5}
                style={{ color: "#bfbfbf", fontSize: 14 }}
              >
                오늘 인수인계가 없습니다.
              </Flex>
            ) : (
              <Flex flexDir={"column"}>
                {mainData.todayNotes.map((note) => (
                  <Flex
                    key={note.noteId}
                    flexDir={"column"}
                    gap={1}
                    p={"10px 4px"}
                    style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                    onClick={() => navigate(`/group/${user.groupId}/note/${note.noteId}`)}
                  >
                    <Flex justify={"space-between"} align={"center"}>
                      <AntText strong style={{ fontSize: 13 }}>
                        {note.user.userName}
                      </AntText>
                      <AntText type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(note.createdAt).format("HH:mm")}
                      </AntText>
                    </Flex>
                    <AntText
                      type="secondary"
                      style={{
                        fontSize: 13,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {note.content}
                    </AntText>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        </>
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
            <AntText>불러오는 중...</AntText>
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
                    <AntText style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
                      {note.content}
                    </AntText>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>

      <CreateGroupModal open={open} onClose={() => setOpen(false)} />
    </Flex>
  );
};

export default IndexPage;