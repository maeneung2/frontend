import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";

interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  setLogin: (accessToken: string, refreshToken: string, user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
      setLogin: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user }),
      updateUser: (partial) => set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
      clear: () => set({ accessToken: undefined, refreshToken: undefined, user: undefined }),
    }),
    { name: "auth-storage" }
  )
);
