export interface User {
  id: string;
  userId: string;
  userName: string;
  phone: string | null;
  groupId: string | null;
  userProfile: string | null;
  admin: boolean;
}