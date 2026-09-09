import type { User } from "./user";

/** /api/v1/note/list 응답 아이템 */
export interface NoteItem {
  noteId: string;
  content: string;
  date: string;
  user: User;
  createdAt: string;
}

/** /api/v1/note/list/by-date 응답 아이템 */
export interface NoteDateItem {
  noteId: string;
  date: string;
  content: string;
  writer: string;
}

/** /api/v1/note/:id 상세 응답 */
export interface Note {
  noteId: string;
  content: string;
  date: string;
  writer: string;
  user: User;
  createdAt: string;
}
