import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography, Spin } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../../api/axios";
import type { InitData } from "../../../components/schedule/scheduleTypes";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleFullscreenOverlay from "../../../components/schedule/ScheduleFullscreenOverlay";
import PageHeader from "../../../components/common/PageHeader";

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
  user?: {
    userId: string;
    userName: string;
    userProfile: string | null;
  };
}

interface ScheduleDetail {
  scheduleId: string;
  groupId: string;
  date: string;
  createdAt: string;
  schedule: number[][];
  workers: ScheduleWorker[];
}

const GroupScheduleDetailPage = () => {
  const { group_id, schedule_id } = useParams();
  const [detail, setDetail] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/schedule/${schedule_id}`);
        setDetail(res.data.data);
      } catch {
        alert("스케줄을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [group_id, schedule_id]);

  if (loading) {
    return (
      <Flex justify={"center"} align={"center"} p={8}>
        <Spin />
      </Flex>
    );
  }

  if (!detail) return null;

  const date = dayjs(detail.date);
  const initData: InitData = {
    numDays: date.daysInMonth(),
    firstWeekday: date.day(),
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
  };

  return (
    <>
      <Flex flexDir={"column"} gap={4} p={4}>
        <PageHeader
          title={`${date.format("YYYY년 MM월")} 스케줄`}
          extra={<Button icon={<FullscreenOutlined />} onClick={() => setFullscreen(true)} />}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          생성일: {dayjs(detail.createdAt).format("YYYY-MM-DD HH:mm")}
        </Text>

        <ScheduleTable initData={initData} schedule={detail.schedule} />
      </Flex>

      {fullscreen && (
        <ScheduleFullscreenOverlay onClose={() => setFullscreen(false)}>
          <ScheduleTable initData={initData} schedule={detail.schedule} cellSize={44} />
        </ScheduleFullscreenOverlay>
      )}
    </>
  );
};

export default GroupScheduleDetailPage;
