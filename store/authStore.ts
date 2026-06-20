import { create } from "zustand";
import api from "@/lib/api";
import { loginUser, registerUser, logoutUser } from "@/lib/auth";

type Role = "talent" | "startup";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: Role;
  isVerified?: boolean;
  onboardingCompleted: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  authChecked: boolean;
  login: (data: { email: string; password: string }) => Promise<User>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<User | null>;
  fetchUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

let fetchingUser = false;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  authChecked: false,

  login: async (data) => {
    set({ loading: true });

    try {
      const res = await loginUser(data);
      const token = res.accessToken || res.token;

      if (token) localStorage.setItem("accessToken", token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

      set({
        user: res.user,
        loading: false,
        authChecked: true,
      });

      return res.user;
    } catch (error) {
      set({ loading: false, authChecked: true });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true });

    try {
      const res = await registerUser(data);
      const token = res.accessToken || res.token;

      if (token) localStorage.setItem("accessToken", token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

      set({
        user: res.user || null,
        loading: false,
        authChecked: true,
      });

      return res.user || null;
    } catch (error) {
      set({ loading: false, authChecked: true });
      throw error;
    }
  },

  fetchUser: async () => {
    if (fetchingUser) return;

    fetchingUser = true;

    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data.user,
        authChecked: true,
      });

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      localStorage.removeItem("user");

      set({
        user: null,
        authChecked: true,
      });
    } finally {
      fetchingUser = false;
    }
  },

  checkAuth: async () => {
    if (typeof window === "undefined") return;

    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data.user,
        authChecked: true,
      });

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch {
      localStorage.removeItem("user");

      set({
        user: null,
        authChecked: true,
      });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    set({
      user: null,
      authChecked: true,
    });
  },
}));