import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Input, List, Popconfirm, Typography } from "antd";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import type { Comment } from "../../types/notice";

const { Text } = Typography;

interface Props {
  groupId: string;
  noticeId: string;
}

const CommentSection = ({ groupId, noticeId }: Props) => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const queryKey = ["comments", groupId, noticeId];

  const { data: comments = [], isLoading: loading } = useQuery<Comment[]>({
    queryKey,
    queryFn: () =>
      api
        .get(`/api/v1/comment/${groupId}/list`, { params: { noticeId } })
        .then((r) => r.data.data),
  });

  const { mutate: submitComment, isPending: submitting } = useMutation({
    mutationFn: (content: string) =>
      api
        .post("/api/v1/comment", { groupId, noticeId, content })
        .then((r) => r.data.data as Comment),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(queryKey, (prev) => [...(prev ?? []), newComment]);
      setInput("");
    },
    onError: () => alert("댓글 등록에 실패했습니다."),
  });

  const { mutate: editComment } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      api.patch(`/api/v1/comment/${groupId}/${commentId}`, { content }),
    onSuccess: (_, { commentId, content }) => {
      queryClient.setQueryData<Comment[]>(queryKey, (prev) =>
        prev?.map((c) => (c.commentId === commentId ? { ...c, content } : c)) ?? []
      );
      setEditingId(null);
    },
    onError: () => alert("댓글 수정에 실패했습니다."),
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) =>
      api.delete(`/api/v1/comment/${groupId}/${commentId}`),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData<Comment[]>(queryKey, (prev) =>
        prev?.filter((c) => c.commentId !== commentId) ?? []
      );
    },
    onError: () => alert("댓글 삭제에 실패했습니다."),
  });

  const handleSubmit = () => {
    if (!input.trim()) return;
    submitComment(input.trim());
  };

  const handleEdit = (commentId: string) => {
    if (!editContent.trim()) return;
    editComment({ commentId, content: editContent.trim() });
  };

  return (
    <Flex flexDir={"column"} gap={3}>
      <Text strong>댓글 {comments.length}개</Text>

      <List
        loading={loading}
        dataSource={comments}
        locale={{ emptyText: "첫 번째 댓글을 남겨보세요." }}
        renderItem={(comment) => {
          const isOwner = user?.id === comment.writer;
          const isEditing = editingId === comment.commentId;

          return (
            <List.Item style={{ padding: "8px 0", alignItems: "flex-start" }}>
              <Flex flexDir={"column"} gap={1} style={{ width: "100%" }}>
                <Flex justify={"space-between"} align={"center"}>
                  <Text style={{ fontSize: 12 }} type="secondary">
                    {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                  </Text>
                  {isOwner && !isEditing && (
                    <Flex gap={1}>
                      <Button
                        size="small"
                        type="text"
                        onClick={() => {
                          setEditingId(comment.commentId);
                          setEditContent(comment.content);
                        }}
                      >
                        수정
                      </Button>
                      <Popconfirm
                        title="댓글을 삭제하시겠습니까?"
                        onConfirm={() => deleteComment(comment.commentId)}
                        okText="삭제"
                        cancelText="취소"
                        okButtonProps={{ danger: true }}
                      >
                        <Button size="small" type="text" danger>
                          삭제
                        </Button>
                      </Popconfirm>
                    </Flex>
                  )}
                </Flex>

                {isEditing ? (
                  <Flex gap={2}>
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onPressEnter={() => handleEdit(comment.commentId)}
                      size="small"
                    />
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleEdit(comment.commentId)}
                    >
                      저장
                    </Button>
                    <Button size="small" onClick={() => setEditingId(null)}>
                      취소
                    </Button>
                  </Flex>
                ) : (
                  <Text style={{ fontSize: 14 }}>{comment.content}</Text>
                )}
              </Flex>
            </List.Item>
          );
        }}
      />

      <Flex gap={2}>
        <Input
          placeholder="댓글을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSubmit}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!input.trim()}
        >
          등록
        </Button>
      </Flex>
    </Flex>
  );
};

export default CommentSection;