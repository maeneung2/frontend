import type { RouteObject } from "react-router-dom";
import GroupMainPage from "../pages/group/groupMainPage.tsx";
import NoticePage from "../pages/group/notice/noticePage.tsx";
import NoticeDetailPage from "../pages/group/notice/noticeDetailPage.tsx";
import NotePage from "../pages/group/note/notePage.tsx";
import NoteDetailPage from "../pages/group/note/noteDetailPage.tsx";
import NoticeWritePage from "../pages/group/notice/noticeWritePage.tsx";
import NoteWritePage from "../pages/group/note/noteWritePage.tsx";
import GroupSettingPage from "../pages/group/setting/groupSettingPage.tsx";
import GroupScheduleSettingPage from "../pages/group/setting/groupScheduleSettingPage.tsx";
import GroupScheduleEditPage from "../pages/group/setting/groupScheduleEditPage.tsx";
import GroupScheduleDetailPage from "../pages/group/setting/groupScheduleDetailPage.tsx";
import GroupUserSettingPage from "../pages/group/setting/groupUserSettingPage.tsx";

import PrivateRoute from "../components/PrivateRoute.tsx";

const GroupRouter: RouteObject = {
  path: "/group",
  element: <PrivateRoute />,
  children: [
    { path: "/group/:group_id", element: <GroupMainPage /> },
    { path: "/group/:group_id/notice", element: <NoticePage /> },
    { path: "/group/:group_id/notice/write", element: <NoticeWritePage /> },
    { path: "/group/:group_id/notice/:notice_id", element: <NoticeDetailPage /> },
    { path: "/group/:group_id/notice/:notice_id/edit", element: <NoticeWritePage /> },
    { path: "/group/:group_id/note", element: <NotePage /> },
    { path: "/group/:group_id/note/write", element: <NoteWritePage /> },
    { path: "/group/:group_id/note/:note_id", element: <NoteDetailPage /> },
    { path: "/group/:group_id/note/:note_id/edit", element: <NoteWritePage /> },
    { path: "/group/:group_id/setting", element: <GroupSettingPage /> },
    { path: "/group/:group_id/setting/schedule", element: <GroupScheduleSettingPage /> },
    { path: "/group/:group_id/setting/schedule/create", element: <GroupScheduleEditPage /> },
    { path: "/group/:group_id/setting/schedule/:schedule_id", element: <GroupScheduleDetailPage /> },
    { path: "/group/:group_id/setting/schedule/:schedule_id/edit", element: <GroupScheduleEditPage /> },
    { path: "/group/:group_id/setting/user", element: <GroupUserSettingPage /> },
  ],
};

export default GroupRouter;
