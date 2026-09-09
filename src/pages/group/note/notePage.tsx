import { Flex } from "@chakra-ui/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import NoteList, { type NoteItem } from "../../../components/note/NoteList";
import PageHeader from "../../../components/common/PageHeader";

const NotePage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();

  const { data: notes = [], isLoading: loading } = useQuery<NoteItem[]>({
    queryKey: ["notes", group_id],
    queryFn: () =>
      api.get("/api/v1/note/list", { params: { groupId: group_id } }).then((r) => r.data.data),
    enabled: !!group_id,
  });

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader
        title="인수인계"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/group/${group_id}/note/write`)}
          >
            작성
          </Button>
        }
      />

      <NoteList groupId={group_id!} notes={notes} loading={loading} />
    </Flex>
  );
};

export default NotePage;