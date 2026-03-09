import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Divider, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/authStore";
import { api } from "../../../api/axios";
import type { Notice } from "../../../types/notice";
import CommentSection from "../../../components/notice/CommentSection";
import DetailPageHeader from "../../../components/common/DetailPageHeader";

const { Paragraph: P } = Typography;

const NoticeDetailPage = () => {
  const { group_id, notice_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;

  const {
    data: notice,
    isLoading: loading,
    isError,
  } = useQuery<Notice>({
    queryKey: ["notice", group_id, notice_id],
    queryFn: () => api.get(`/api/v1/notice/${group_id}/${notice_id}`).then((r) => r.data.data),
    enabled: !!group_id && !!notice_id,
  });

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const { mutate: deleteNotice, isPending: deleteLoading } = useMutation({
    mutationFn: () => api.delete(`/api/v1/notice/${group_id}/${notice_id}`),
    onSuccess: () => navigate(`/group/${group_id}/notice`),
    onError: () => alert("삭제에 실패했습니다."),
  });

  if (loading) {
    return (
      <Flex justify={"center"} align={"center"} p={8}>
        <Spin />
      </Flex>
    );
  }

  if (!notice) return null;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <DetailPageHeader
        title={notice.title}
        subtitle={`${notice.user?.userName ?? ""} · ${dayjs(notice.createdAt).format("YYYY-MM-DD HH:mm")}`}
        isOwner={user.userId === notice.writer}
        editPath={`/group/${group_id}/notice/${notice_id}/edit`}
        onDelete={() => deleteNotice()}
        deleteLoading={deleteLoading}
        confirmText="공지사항을 삭제하시겠습니까?"
      />

      <Divider style={{ margin: "4px 0" }} />

      <P style={{ whiteSpace: "pre-wrap", fontSize: 14, minHeight: 120 }}>{notice.content}</P>

      {notice.image?.length > 0 && (
        <Flex flexDir={"column"} gap={2}>
          {notice.image.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              style={{ width: "100%", borderRadius: 8, objectFit: "contain" }}
            />
          ))}
        </Flex>
      )}

      <Divider style={{ margin: "4px 0" }} />

      <CommentSection groupId={group_id!} noticeId={notice_id!} />
    </Flex>
  );
};

export default NoticeDetailPage;
