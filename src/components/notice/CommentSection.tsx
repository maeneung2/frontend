import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Input, List, Popconfirm, Typography } from "antd";
import dayjs from "dayjs";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

const { Text } = Typography;

interface Comment {
  commentId: string;
  content: string;
  writer: string;
  createdAt: string;
}

interface Props {
  groupId: string;
  noticeId: string;
}

const CommentSection = ({ groupId, noticeId }: Props) => {
  const user = useAuthStore((s) => s.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/comment/${groupId}/list`, {
          params: { noticeId },
        });
        setComments(res.data.data);
      } catch {
        // 조용히 처리
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [groupId, noticeId]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post("/api/v1/comment", {
        groupId,
        noticeId,
        content: input.trim(),
      });
      setComments((prev) => [...prev, res.data.data]);
      setInput("");
    } catch {
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      await api.patch(`/api/v1/comment/${groupId}/${commentId}`, {
        content: editContent.trim(),
      });
      setComments((prev) =>
        prev.map((c) => (c.commentId === commentId ? { ...c, content: editContent.trim() } : c))
      );
      setEditingId(null);
    } catch {
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await api.delete(`/api/v1/comment/${groupId}/${commentId}`);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch {
      alert("댓글 삭제에 실패했습니다.");
    }
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
                        onConfirm={() => handleDelete(comment.commentId)}
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
                    <Button size="small" type="primary" onClick={() => handleEdit(comment.commentId)}>
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
        <Button type="primary" onClick={handleSubmit} loading={submitting} disabled={!input.trim()}>
          등록
        </Button>
      </Flex>
    </Flex>
  );
};

export default CommentSection;