import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Spin, Typography } from "antd";
import { FullscreenOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { api } from "../../api/axios";
import type { InitData } from "../schedule/scheduleTypes";
import ScheduleTable from "../schedule/ScheduleTable";
import ScheduleFullscreenOverlay from "../schedule/ScheduleFullscreenOverlay";

const { Text } = Typography;

interface ScheduleWorker {
  id: string;
  userId: string;
  userName: string;
  userProfile: string | null;
  isNight: boolean;
  isNew: boolean;
  admin: boolean;
  targetWorkCount: number;
  scheduleId: string;
  user?: { userId: string; userName: string; userProfile: string | null };
}

interface ScheduleDetail {
  scheduleId: string;
  date: string;
  createdAt: string;
  schedule: number[][];
  workers: ScheduleWorker[];
}

interface Props {
  groupId: string;
}

const GroupScheduleSection = ({ groupId }: Props) => {
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [detail, setDetail] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setDetail(null);
      try {
        const res = await api.get(`/api/v1/group/${groupId}/schedule`, {
          params: { date: calendarDate.format("YYYY-MM-DD") },
        });
        setDetail(res.data.data);
      } catch {
        // 조용히 처리
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [groupId, calendarDate]);

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
          admin: w.admin,
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