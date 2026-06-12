import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  golferId: number | null;
  classCode: string | null;
  email: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, golferId: number, classCode: string, email: string, fullName: string) => void;
  updateToken: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  golferId: null,
  classCode: null,
  email: null,
  fullName: null,
  isAuthenticated: false,
  setAuth: (accessToken, golferId, classCode, email, fullName) =>
    set({ accessToken, golferId, classCode, email, fullName, isAuthenticated: true }),
  updateToken: (accessToken) => set({ accessToken }),
  clearAuth: () =>
    set({ accessToken: null, golferId: null, classCode: null, email: null, fullName: null, isAuthenticated: false }),
}));
