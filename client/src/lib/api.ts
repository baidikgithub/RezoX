"use client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Listing = {
  _id: number | string;
  id: number | string;
  title?: string;
  description?: string;
  location?: string;
  city?: string;
  state?: string;
  address?: string;
  property_type?: string;
  status?: string;
  price?: number;
  total_sqft?: number;
  bhk?: number;
  bath?: number;
  latitude?: number;
  longitude?: number;
  images?: string[];
  amenities?: string[];
  averageRating?: number;
  reviewsCount?: number;
  agent?: { id: number; name: string; email: string; phone?: string };
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("rezox-token");
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("rezox-refresh-token");
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function setSession(token: string, user: any, refreshToken?: string) {
  window.localStorage.setItem("rezox-token", token);
  window.localStorage.setItem("rezox-user", JSON.stringify(user));
  if (refreshToken) window.localStorage.setItem("rezox-refresh-token", refreshToken);
  setCookie("rezox-access-token", token, 60 * 15);
  if (refreshToken) setCookie("rezox-refresh-token-present", "1", 60 * 60 * 24 * 30);
  setCookie("rezox-role", user?.role || "buyer", 60 * 60 * 24 * 30);
}

export function clearSession() {
  window.localStorage.removeItem("rezox-token");
  window.localStorage.removeItem("rezox-refresh-token");
  window.localStorage.removeItem("rezox-user");
  clearCookie("rezox-access-token");
  clearCookie("rezox-refresh-token-present");
  clearCookie("rezox-role");
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  refreshPromise ??= fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  })
    .then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to refresh session.");
      setSession(data.accessToken || data.token, data.user, data.refreshToken);
      return data.accessToken || data.token;
    })
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401) {
    const nextToken = await refreshSession();
    if (nextToken) {
      headers.set("Authorization", `Bearer ${nextToken}`);
      response = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data as T;
}

export function dashboardPath(role?: string) {
  if (role === "admin" || role === "agent") return "/admin";
  return "/profile";
}

export function listingQuery(filters: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}
