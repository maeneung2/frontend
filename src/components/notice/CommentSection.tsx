import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Avatar, Button, Input, List, Popconfirm, Typography } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");

  const queryKey = ["comments", groupId, noticeId];

  const { data: allComments = [], isLoading: loading } = useQuery<Comment[]>({
    queryKey,
    queryFn: () => api.get(`/api/v1/comment/${groupId}/${noticeId}/list`).then((r) => r.data.data),
  });

  const topComments = allComments.filter((c) => !c.targetCommentId);
  const getReplies = (commentId: string) => allComments.filter((c) => c.targetCommentId === commentId);

  const { mutate: submitComment, isPending: submitting } = useMutation({
    mutationFn: (content: string) =>
      api.post("/api/v1/comment", { groupId, noticeId, content }).then((r) => r.data.data as Comment),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(queryKey, (prev) => [...(prev ?? []), newComment]);
      setInput("");
    },
    onError: () => alert("댓글 등록에 실패했습니다."),
  });

  const { mutate: submitReply, isPending: replySubmitting } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      api.post("/api/v1/comment", { groupId, noticeId, content, targetCommentId: commentId }).then((r) => r.data.data as Comment),
    onSuccess: (newReply) => {
      queryClient.setQueryData<Comment[]>(queryKey, (prev) => [...(prev ?? []), newReply]);
      setReplyingTo(null);
      setReplyInput("");
    },
    onError: () => alert("대댓글 등록에 실패했습니다."),
  });

  const { mutate: editComment } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      api.patch(`/api/v1/comment/${groupId}/${commentId}`, { content }),
    onSuccess: (_, { commentId, content }) => {
      queryClient.setQueryData<Comment[]>(
        queryKey,
        (prev) => prev?.map((c) => (c.commentId === commentId ? { ...c, content } : c)) ?? []
      );
      setEditingId(null);
    },
    onError: () => alert("댓글 수정에 실패했습니다."),
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) => api.delete(`/api/v1/comment/${groupId}/${commentId}`),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData<Comment[]>(
        queryKey,
        (prev) => prev?.filter((c) => c.commentId !== commentId) ?? []
      );
    },
    onError: () => alert("댓글 삭제에 실패했습니다."),
  });

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = user?.userId === comment.writer;
    const isEditing = editingId === comment.commentId;
    const replies = isReply ? [] : getReplies(comment.commentId);

    return (
      <Flex key={comment.commentId} flexDir={"column"} style={{ width: "100%" }}>
        <Flex gap={2} style={{ width: "100%", paddingLeft: isReply ? 40 : 0, boxSizing: "border-box" }}>
          <Avatar
            size={isReply ? 26 : 32}
            src={comment.user?.userProfile ?? undefined}
            icon={!comment.user?.userProfile ? <UserOutlined /> : undefined}
          />
          <Flex flexDir={"column"} gap={1} style={{ flex: 1 }}>
            <Flex justify={"space-between"} align={"center"}>
              <Flex gap={2} align={"center"}>
                <Text strong style={{ fontSize: isReply ? 12 : 13 }}>{comment.user?.userName}</Text>
                <Text style={{ fontSize: 11 }} type="secondary">
                  {dayjs(comment.createdAt).format("MM-DD HH:mm")}
                </Text>
              </Flex>
              <Flex gap={1}>
                {!isReply && !isEditing && (
                  <Button
                    size="small"
                    type="text"
                    icon={<MessageOutlined />}
                    style={{ fontSize: 11, color: "#8c8c8c" }}
                    onClick={() => setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)}
                  />
                )}
                {isOwner && !isEditing && (
                  <>
                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingId(comment.commentId);
                        setEditContent(comment.content);
                      }}
                    />
                    <Popconfirm
                      title="삭제하시겠습니까?"
                      onConfirm={() => deleteComment(comment.commentId)}
                      okText="삭제"
                      cancelText="취소"
                      okButtonProps={{ danger: true }}
                    >
                      <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </>
                )}
              </Flex>
            </Flex>

            {isEditing ? (
              <Flex gap={2}>
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onPressEnter={() => editComment({ commentId: comment.commentId, content: editContent.trim() })}
                  size="small"
                />
                <Button size="small" type="primary" onClick={() => editComment({ commentId: comment.commentId, content: editContent.trim() })}>
                  저장
                </Button>
                <Button size="small" onClick={() => setEditingId(null)}>취소</Button>
              </Flex>
            ) : (
              <Text style={{ fontSize: isReply ? 13 : 14 }}>{comment.content}</Text>
            )}
          </Flex>
        </Flex>

        {replies.map((reply) => (
          <Flex key={reply.commentId} style={{ marginTop: 8, width: "100%" }}>
            {renderComment(reply, true)}
          </Flex>
        ))}

        {replyingTo === comment.commentId && (
          <Flex gap={2} style={{ marginTop: 8, paddingLeft: 40, width: "100%", boxSizing: "border-box" }}>
            <Input
              size="small"
              placeholder={`${comment.user?.userName}에게 답글 달기`}
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onPressEnter={() => {
                if (replyInput.trim()) submitReply({ commentId: comment.commentId, content: replyInput.trim() });
              }}
            />
            <Button
              size="small"
              type="primary"
              loading={replySubmitting}
              disabled={!replyInput.trim()}
              onClick={() => submitReply({ commentId: comment.commentId, content: replyInput.trim() })}
            >
              등록
            </Button>
            <Button size="small" onClick={() => { setReplyingTo(null); setReplyInput(""); }}>취소</Button>
          </Flex>
        )}
      </Flex>
    );
  };

  return (
    <Flex flexDir={"column"} gap={3}>
      <Text strong>댓글 {topComments.length}개</Text>

      <List
        loading={loading}
        dataSource={topComments}
        locale={{ emptyText: "첫 번째 댓글을 남겨보세요." }}
        renderItem={(comment) => (
          <List.Item style={{ padding: "8px 0", alignItems: "flex-start", display: "block" }}>
            {renderComment(comment)}
          </List.Item>
        )}
      />

      <Flex gap={2}>
        <Input
          placeholder="댓글을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={() => { if (input.trim()) submitComment(input.trim()); }}
        />
        <Button type="primary" onClick={() => submitComment(input.trim())} loading={submitting} disabled={!input.trim()}>
          등록
        </Button>
      </Flex>
    </Flex>
  );
};

export default CommentSection;