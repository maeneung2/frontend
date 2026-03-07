import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography, Spin } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import type { InitData } from "../../../components/schedule/scheduleTypes";
import type { ScheduleDetail } from "../../../types/schedule";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleFullscreenOverlay from "../../../components/schedule/ScheduleFullscreenOverlay";
import PageHeader from "../../../components/common/PageHeader";

const { Text } = Typography;

const GroupScheduleDetailPage = () => {
  const { schedule_id } = useParams();
  const [fullscreen, setFullscreen] = useState(false);

  const { data: detail, isLoading: loading } = useQuery<ScheduleDetail>({
    queryKey: ["schedule-detail", schedule_id],
    queryFn: () => api.get(`/api/v1/schedule/${schedule_id}`).then((r) => r.data.data),
    enabled: !!schedule_id,
  });

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