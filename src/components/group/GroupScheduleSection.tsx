import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Spin, Typography } from "antd";
import { FullscreenOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { InitData } from "../schedule/scheduleTypes";
import type { ScheduleDetail } from "../../types/schedule";
import ScheduleTable from "../schedule/ScheduleTable";
import ScheduleFullscreenOverlay from "../schedule/ScheduleFullscreenOverlay";

const { Text } = Typography;

interface Props {
  groupId: string;
}

const GroupScheduleSection = ({ groupId }: Props) => {
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [fullscreen, setFullscreen] = useState(false);

  const { data: detail, isLoading: loading } = useQuery<ScheduleDetail | null>({
    queryKey: ["group-schedule", groupId, calendarDate.format("YYYY-MM")],
    queryFn: () =>
      api
        .get(`/api/v1/group/${groupId}/schedule`, {
          params: { date: calendarDate.format("YYYY-MM-DD") },
        })
        .then((r) => r.data.data),
  });

  const initData: InitData | null = detail
    ? {
        numDays: dayjs(detail.date).daysInMonth(),
        firstWeekday: dayjs(detail.date).day(),
        targetWorkCount: 0,
        selectedDay: [],
        selectedNight: [],
        workers: detail.workers.map((w) => ({
          userId: w.userId ?? w.user?.userId ?? w.id,
          userName: w.userName ?? w.user?.userName ?? "",
          userProfile: w.userProfile ?? w.user?.userProfile,
          isNight: w.isNight,
          targetWorkCount: w.targetWorkCount,
        })),
      }
    : null;

  return (
    <Flex flexDir={"column"} gap={3}>
      <Flex justify={"space-between"} align={"center"}>
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
        {detail && (
          <Button icon={<FullscreenOutlined />} size="small" onClick={() => setFullscreen(true)} />
        )}
      </Flex>

      {loading ? (
        <Flex justify={"center"} p={6}>
          <Spin />
        </Flex>
      ) : initData && detail ? (
        <ScheduleTable initData={initData} schedule={detail.schedule} />
      ) : (
        <Flex justify={"center"} align={"center"} p={6} style={{ color: "#bfbfbf", fontSize: 14 }}>
          해당 월의 스케줄이 없습니다.
        </Flex>
      )}

      {fullscreen && initData && detail && (
        <ScheduleFullscreenOverlay onClose={() => setFullscreen(false)}>
          <ScheduleTable initData={initData} schedule={detail.schedule} cellSize={44} />
        </ScheduleFullscreenOverlay>
      )}
    </Flex>
  );
};

export default GroupScheduleSection;
