import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../interface/user";

interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  setLogin: (accessToken: string, refreshToken: string, user: User) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
      setLogin: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user }),
      clear: () => set({ accessToken: undefined, refreshToken: undefined, user: undefined }),
    }),
    { name: "auth-storage" }
  )
);
