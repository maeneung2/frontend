import { useEffect, useState } from "react";
import { Divider, Empty, List, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../api/axios";

const { Title, Text } = Typography;

interface Notice {
  noticeId: string;
  title: string;
  createdAt: string;
}

interface Note {
  noteId: string;
  content: string;
}

interface Props {
  groupId: string;
}

const GroupSummarySection = ({ groupId }: Props) => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [todayNotes, setTodayNotes] = useState<Note[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setNoticesLoading(true);
      setNotesLoading(true);
      const today = dayjs().format("YYYY-MM-DD");
      await Promise.all([
        api
          .get(`/api/v1/notice/${groupId}/list`)
          .then((res) => setNotices((res.data.data ?? []).slice(0, 3)))
          .catch(() => {})
          .finally(() => setNoticesLoading(false)),
        api
          .get("/api/v1/note/list/by-date", { params: { date: today } })
          .then((res) => setTodayNotes(res.data.data ?? []))
          .catch(() => {})
          .finally(() => setNotesLoading(false)),
      ]);
    };
    void fetchData();
  }, [groupId]);

  return (
    <>
      <Divider style={{ margin: "4px 0" }} />

      <Title level={5} style={{ margin: 0 }}>
        최근 공지사항
      </Title>
      {noticesLoading ? (
        <Spin size="small" />
      ) : notices.length === 0 ? (
        <Empty description="공지사항이 없습니다." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          size="small"
          dataSource={notices}
          renderItem={(notice) => (
            <List.Item
              key={notice.noticeId}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/group/${groupId}/notice/${notice.noticeId}`)}
            >
              <List.Item.Meta
                title={<Text style={{ fontSize: 13 }}>{notice.title}</Text>}
                description={
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {dayjs(notice.createdAt).format("YYYY-MM-DD HH:mm")}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}

      <Divider style={{ margin: "4px 0" }} />

      <Title level={5} style={{ margin: 0 }}>
        오늘의 인수인계
      </Title>
      {notesLoading ? (
        <Spin size="small" />
      ) : todayNotes.length === 0 ? (
        <Empty description="오늘 등록된 인수인계가 없습니다." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          size="small"
          dataSource={todayNotes}
          renderItem={(note) => (
            <List.Item key={note.noteId}>
              <Text style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{note.content}</Text>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default GroupSummarySection;