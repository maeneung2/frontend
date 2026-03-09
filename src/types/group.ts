import type { User } from "./user.ts";

export interface GroupData {
  groupId: string;
  groupName: string;
  groupProfile?: string;
  owner: string;
  members: User[];
}
