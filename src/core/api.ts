// مسار الملف: src/core/api.ts

import type { CoachSignupPayload, SwimmerSignupPayload } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-academy-production-c1ab.up.railway.app/api";

const TOKEN_KEY = "swim-master-token";
const USER_KEY  = "swim-master-user";

export function saveSession(data: { token?: string; user?: Record<string, any> }) {
  if (typeof window === "undefined") return;
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.user)  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getSessionUser(): Record<string, any> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.clear();
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "حدث خطأ في الاتصال بالخادم");
  }

  return data;
}

export async function loginUser(credentials: { email?: string; username?: string; password: string }) {
  const data = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email || credentials.username,
      password: credentials.password,
    }),
  });
  saveSession({ token: data?.token, user: data?.user ?? data });
  return data;
}

export async function submitSwimmerSignupDraft(payload: SwimmerSignupPayload) {
  const data = await fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      role: "swimmer",
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirmPassword,
      first_name: payload.firstName,
      last_name: payload.lastName,
      gender: payload.gender,
      age: Number(payload.age),
      phone: payload.phone,
      level: payload.level,
    }),
  });
  return data;
}

export async function submitCoachSignupDraft(payload: CoachSignupPayload) {
  const data = await fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      role: "coach",
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirmPassword,
      first_name: payload.firstName,
      last_name: payload.lastName,
      gender: payload.gender,
      phone: payload.phone,
    }),
  });

  // يجب جلب التوكن وتسجيل الدخول للمدرب الجديد لإكمال إعداد الجدول
  const loginRes = await loginUser({ email: payload.email, password: payload.password });

  if (loginRes?.token && payload.workingDays.length > 0) {
    await fetchApi("/coach/setup", {
      method: "POST",
      body: JSON.stringify({
        days: payload.workingDays,
        times: payload.workingHours,
      }),
    });
  }

  return data;
}

export const BookingsAPI = {
  getAll: (extraParams: Record<string, any> = {}) => {
    const query = new URLSearchParams(Object.fromEntries(Object.entries(extraParams).map(([k, v]) => [k, String(v)]))).toString();
    return fetchApi(`/bookings${query ? `?${query}` : ""}`, { method: "GET" });
  },
  create: (data: any) => fetchApi("/bookings", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (bookingId: number, data: any) => fetchApi(`/bookings/${bookingId}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (bookingId: number, data?: any) => fetchApi(`/bookings/${bookingId}`, { method: "DELETE", ...(data ? { body: JSON.stringify(data) } : {}) }),
};

export const ScheduleAPI = {
  // تم تحويل الميثود إلى POST لتتطابق مع الباك إند
  getSchedule: () => fetchApi("/schedule", { method: "POST", body: JSON.stringify({}) }),
};

export const AttendanceAPI = {
  get: (extraParams: Record<string, any> = {}) => {
    const query = new URLSearchParams(Object.fromEntries(Object.entries(extraParams).map(([k, v]) => [k, String(v)]))).toString();
    return fetchApi(`/attendance${query ? `?${query}` : ""}`, { method: "GET" });
  },
  log: (data: any) => fetchApi("/attendance", { method: "POST", body: JSON.stringify(data) }),
  update: (attendanceId: number, data: any) => fetchApi(`/attendance/${attendanceId}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (attendanceId: number, data?: any) => fetchApi(`/attendance/${attendanceId}`, { method: "DELETE", ...(data ? { body: JSON.stringify(data) } : {}) }),
};

export const TeamsAPI = {
  getAll: () => fetchApi("/teams", { method: "GET" }),
  create: (data: any) => fetchApi("/teams", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchApi(`/teams/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi(`/teams/${id}`, { method: "DELETE" }),
};

export const ClassesAPI = {
  getAll: () => fetchApi("/classes", { method: "GET" }),
  create: (data: any) => fetchApi("/classes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchApi(`/classes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi(`/classes/${id}`, { method: "DELETE" }),
};

export const CoachAPI = {
  getList: () => fetchApi("/coach/list", { method: "GET" }),
  getDays: () => fetchApi("/coach/days", { method: "GET" }),
  getTimes: () => fetchApi("/coach/times", { method: "GET" }),
  getAvailability: (coachId?: number) => fetchApi(`/coach/availability${coachId ? `?coach_id=${coachId}` : ""}`, { method: "GET" }),
  setup: (data: any) => fetchApi("/coach/setup", { method: "POST", body: JSON.stringify(data) }),
};

// ✅ Manager Only — GET /users/list?type=swimmer|coach
export const UsersAPI = {
  getSwimmers: () => fetchApi("/users/list?type=swimmer", { method: "GET" }),
  getCoaches:  () => fetchApi("/users/list?type=coach",   { method: "GET" }),
};