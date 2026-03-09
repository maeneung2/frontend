import type { User } from "./user";

export interface NoticeItem {
  noticeId: string;
  title: string;
  user: User;
  createdAt: string;
}

export interface Notice {
  noticeId: string;
  title: string;
  content: string;
  image: string[];
  writer: string;
  createdAt: string;
}

export interface Comment {
  commentId: string;
  content: string;
  writer: string;
  createdAt: string;
}
