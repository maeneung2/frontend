import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Divider, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import CommentSection from "../../../components/notice/CommentSection";
import DetailPageHeader from "../../../components/common/DetailPageHeader";

const { Paragraph: P } = Typography;

interface Notice {
  noticeId: string;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
}

const NoticeDetailPage = () => {
  const { group_id, notice_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/notice/${group_id}/${notice_id}`);
        setNotice(res.data.data);
      } catch {
        alert("공지사항을 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [group_id, notice_id, navigate]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/v1/notice/${group_id}/${notice_id}`);
      navigate(`/group/${group_id}/notice`);
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

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
        subtitle={dayjs(notice.createdAt).format("YYYY-MM-DD HH:mm")}
        isOwner={user?.id === notice.writer}
        editPath={`/group/${group_id}/notice/${notice_id}/edit`}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        confirmText="공지사항을 삭제하시겠습니까?"
      />

      <Divider style={{ margin: "4px 0" }} />

      <P style={{ whiteSpace: "pre-wrap", fontSize: 14, minHeight: 120 }}>{notice.content}</P>

      <Divider style={{ margin: "4px 0" }} />

      <CommentSection groupId={group_id!} noticeId={notice_id!} />
    </Flex>
  );
};

export default NoticeDetailPage;