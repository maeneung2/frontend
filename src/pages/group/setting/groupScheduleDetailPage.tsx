import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Typography, Spin } from "antd";
import { EditOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import type { InitData, ScheduleDetail } from "../../../components/schedule/scheduleTypes";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleFullscreenOverlay from "../../../components/schedule/ScheduleFullscreenOverlay";
import PageHeader from "../../../components/common/PageHeader";

const { Text } = Typography;

const GroupScheduleDetailPage = () => {
  const { group_id, schedule_id } = useParams();
  const navigate = useNavigate();
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
    restCount: 0,
    selectedDay: [],
    selectedNight: [],
    workers: detail.workers,
  };

  return (
    <>
      <Flex flexDir={"column"} gap={4} p={4}>
        <PageHeader
          title={`${date.format("YYYY년 MM월")} 스케줄`}
          extra={
            <Flex gap={2}>
              <Button icon={<FullscreenOutlined />} onClick={() => setFullscreen(true)} />
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate(`/group/${group_id}/setting/schedule/${schedule_id}/edit`)}
              >
                편집
              </Button>
            </Flex>
          }
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          생성일: {dayjs(detail.createdAt).format("YYYY-MM-DD HH:mm")}
        </Text>

        <ScheduleTable initData={initData} schedule={detail.workers.map((w) => w.plan)} />
      </Flex>

      {fullscreen && (
        <ScheduleFullscreenOverlay onClose={() => setFullscreen(false)}>
          <ScheduleTable
            initData={initData}
            schedule={detail.workers.map((w) => w.plan)}
            cellSize={44}
          />
        </ScheduleFullscreenOverlay>
      )}
    </>
  );
};

export default GroupScheduleDetailPage;
