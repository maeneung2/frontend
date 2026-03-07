export interface Member {
  userId: string;
  userName: string;
  userProfile?: string | null;
}

export interface GroupData {
  groupId: string;
  groupName: string;
  groupProfile?: string;
  owner: string;
  members: Member[];
}