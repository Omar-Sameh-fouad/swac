// مسار الملف: src/core/api.ts

import type { CoachSignupPayload, SwimmerSignupPayload } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-academy-production-c1ab.up.railway.app/api";

// ==========================================
// 0. Session Helpers — Token & User
// ==========================================

const TOKEN_KEY = "swim-master-token";
const USER_KEY  = "swim-master-user";

/** يحفظ التوكن والـ user بعد login/register ناجح */
export function saveSession(data: { token?: string; user?: Record<string, any> }) {
  if (typeof window === "undefined") return;
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.user)  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

/** يرجع التوكن المحفوظ (أو null لو مفيش) */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** يرجع الـ user المحفوظ بعد الـ login (أو null) */
export function getSessionUser(): Record<string, any> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** يمسح الـ session عند الـ logout */
export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ==========================================
// 1. الأساسيات (Fetch Wrapper)
// ==========================================

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // ✅ إصلاح رئيسي: إضافة Authorization header في كل طلب
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

// ==========================================
// 2. المصادقة والتسجيل (Auth)
// ==========================================

export async function loginUser(credentials: { email?: string; username?: string; password: string }) {
  const data = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email || credentials.username,
      password: credentials.password,
    }),
  });

  // ✅ إصلاح: حفظ التوكن والـ user بعد login نجاح مباشرةً
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

  // ✅ حفظ التوكن لو الـ register رجّع واحد مباشرةً
  saveSession({ token: data?.token, user: data?.user ?? data });

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

  // ✅ حفظ التوكن فوراً — لازم يكون موجود قبل استدعاء /coach/setup
  saveSession({ token: data?.token, user: data?.user ?? data });

  const coachId = data?.user?.id ?? data?.id;

  if (coachId && payload.workingDays.length > 0) {
    // ✅ الآن fetchApi هيبعت التوكن تلقائياً — مش محتاجين role/coach_id في الـ body
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

// ==========================================
// 3. الحجوزات (Bookings)
// ==========================================

export const BookingsAPI = {
  // ✅ إصلاح: شيلنا role من query params — الباك بيعتمد على الـ JWT بس
  getAll: (extraParams: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(extraParams).map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return fetchApi(`/bookings${query ? `?${query}` : ""}`, { method: "GET" });
  },
  create: (data: any) => {
    return fetchApi("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateStatus: (bookingId: number, data: any) => {
    return fetchApi(`/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: (bookingId: number, data?: any) => {
    return fetchApi(`/bookings/${bookingId}`, {
      method: "DELETE",
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
  },
};

// ==========================================
// 4. الجداول والحضور (Schedule & Attendance)
// ==========================================

export const ScheduleAPI = {
  // ✅ الباك يعرف الـ user من التوكن — مش محتاجين نبعت role/userId في الـ body
  getSchedule: () => {
    return fetchApi("/schedule", { method: "GET" });
  },
};

export const AttendanceAPI = {
  // ✅ إصلاح: شيلنا role وإضافة extra params اختيارية فقط
  get: (extraParams: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(extraParams).map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return fetchApi(`/attendance${query ? `?${query}` : ""}`, { method: "GET" });
  },
  log: (data: any) => {
    return fetchApi("/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: (attendanceId: number, data: any) => {
    return fetchApi(`/attendance/${attendanceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: (attendanceId: number, data?: any) => {
    return fetchApi(`/attendance/${attendanceId}`, {
      method: "DELETE",
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
  },
};

// ==========================================
// 5. الفرق والفصول (Teams & Classes)
// ==========================================

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

// ==========================================
// 6. المدربين (Coach)
// ==========================================

export const CoachAPI = {
  // ✅ شيلنا role=manager من الـ query — الباك يعرف الـ role من التوكن
  getList: () => fetchApi("/coach/list", { method: "GET" }),
  getDays: () => fetchApi("/coach/days", { method: "GET" }),
  getTimes: () => fetchApi("/coach/times", { method: "GET" }),
  getAvailability: (coachId: number) => {
    return fetchApi(`/coach/availability?coach_id=${coachId}`, { method: "GET" });
  },
  setup: (data: any) => fetchApi("/coach/setup", { method: "POST", body: JSON.stringify(data) }),
};
