import { Flex } from "@chakra-ui/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import NoticeList, { type NoticeItem } from "../../../components/notice/NoticeList";
import PageHeader from "../../../components/common/PageHeader";

const NoticePage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();

  const { data: notices = [], isLoading: loading } = useQuery<NoticeItem[]>({
    queryKey: ["notices", group_id],
    queryFn: () =>
      api.get(`/api/v1/notice/${group_id}/list`).then((r) => r.data.data),
    enabled: !!group_id,
  });

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader
        title="공지사항"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/group/${group_id}/notice/write`)}
          >
            작성
          </Button>
        }
      />

      <NoticeList groupId={group_id!} notices={notices} loading={loading} />
    </Flex>
  );
};

export default NoticePage;