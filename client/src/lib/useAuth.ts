"use client";

import { create } from "zustand";
import { apiFetch, clearSession, getRefreshToken, setSession } from "./api";

export type Role = "admin" | "agent" | "buyer" | "user";
export type User = { id: number; name: string; email: string; role: Role; phone?: string; avatar?: string; bio?: string };

type AuthState = {
  user: User | null;
  ready: boolean;
  hydrate: () => void;
  refresh: () => Promise<User | null>;
  signin: (email: string, password: string) => Promise<User>;
  signup: (payload: { name: string; email: string; password: string; role?: Role }) => Promise<User>;
  signout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  ready: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("rezox-user");
    set({ user: raw ? JSON.parse(raw) : null, ready: true });
  },
  refresh: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      set({ user: null, ready: true });
      return null;
    }
    try {
      const data = await apiFetch<{ token: string; accessToken: string; refreshToken: string; user: User }>("/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      });
      setSession(data.accessToken || data.token, data.user, data.refreshToken);
      set({ user: data.user, ready: true });
      return data.user;
    } catch (_error) {
      clearSession();
      set({ user: null, ready: true });
      return null;
    }
  },
  signin: async (email, password) => {
    const data = await apiFetch<{ token: string; accessToken: string; refreshToken: string; user: User }>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    setSession(data.accessToken || data.token, data.user, data.refreshToken);
    set({ user: data.user });
    return data.user;
  },
  signup: async (payload) => {
    const data = await apiFetch<{ token: string; accessToken: string; refreshToken: string; user: User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setSession(data.accessToken || data.token, data.user, data.refreshToken);
    set({ user: data.user });
    return data.user;
  },
  signout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      }).catch(() => undefined);
    }
    clearSession();
    set({ user: null });
  }
}));

export function canManage(role?: Role) {
  return role === "admin" || role === "agent";
}
