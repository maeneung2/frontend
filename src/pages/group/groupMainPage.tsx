import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Spin } from "antd";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

interface GroupData {
  groupId: string;
  groupName: string;
  groupProfile?: string;
  owner: string;
  members: { userId: string; userName: string; userProfile?: string }[];
}

const GroupMainPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    api.get(`/api/v1/group/${group_id}`)
      .then((res) => setGroup(res.data.data))
      .catch(() => setGroup(null))
      .finally(() => setLoading(false));
  }, [group_id]);

  const handleDelete = () => {
    Modal.confirm({
      title: "그룹 삭제",
      content: `'${group?.groupName}' 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: async () => {
        setDeleteLoading(true);
        try {
          await api.delete(`/api/v1/group/${group_id}`);
          navigate("/");
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  if (loading) return <Spin fullscreen />;

  if (!group) return <Flex>그룹을 찾을 수 없습니다.</Flex>;

  const isOwner = user?.id === group.owner;

  return (
    <Flex flexDir={"column"}>
      {group.groupName}
      <Link to={`/group/${group_id}/notice`}>공지사항 페이지</Link>
      <Link to={`/group/${group_id}/note`}>인수인계 페이지</Link>
      <Link to={`/group/${group_id}/setting`}>그룹 설정 페이지</Link>
      {isOwner && (
        <Button danger loading={deleteLoading} onClick={handleDelete}>
          그룹 삭제하기
        </Button>
      )}
    </Flex>
  );
};

export default GroupMainPage;
