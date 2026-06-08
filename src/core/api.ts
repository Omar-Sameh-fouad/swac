// مسار الملف: src/core/api.ts

import type { CoachSignupPayload, SwimmerSignupPayload } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-academy-production-c1ab.up.railway.app/api";

// ==========================================
// 1. الأساسيات (Fetch Wrapper)
// ==========================================
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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
  return fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email || credentials.username,
      password: credentials.password,
    }),
  });
}

export async function submitSwimmerSignupDraft(payload: SwimmerSignupPayload) {
  const registerResponse = await fetchApi("/auth/register", {
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

  return registerResponse;
}

export async function submitCoachSignupDraft(payload: CoachSignupPayload) {
  const registerResponse = await fetchApi("/auth/register", {
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

  const coachId = registerResponse?.user?.id || registerResponse?.id;

  if (coachId && payload.workingDays.length > 0) {
    await fetchApi("/coach/setup", {
      method: "POST",
      body: JSON.stringify({
        role: "coach",
        coach_id: coachId,
        logged_coach_id: coachId,
        days: payload.workingDays,
        times: payload.workingHours,
      }),
    });
  }

  return registerResponse;
}

// ==========================================
// 3. الحجوزات (Bookings)
// ==========================================

export const BookingsAPI = {
  getAll: (role: string, extraParams: Record<string, any> = {}) => {
    const query = new URLSearchParams({ role, ...extraParams }).toString();
    return fetchApi(`/bookings?${query}`, { method: "GET" });
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
  delete: (bookingId: number, data: any) => {
    return fetchApi(`/bookings/${bookingId}`, {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  },
};

// ==========================================
// 4. الجداول والحضور (Schedule & Attendance)
// ==========================================

export const ScheduleAPI = {
  getSchedule: (role: string, userIdKey: string, userId: number) => {
    return fetchApi("/schedule", {
      method: "POST",
      body: JSON.stringify({
        role,
        [userIdKey]: userId,
      }),
    });
  },
};

export const AttendanceAPI = {
  get: (role: string, extraParams: Record<string, any> = {}) => {
    const query = new URLSearchParams({ role, ...extraParams }).toString();
    return fetchApi(`/attendance?${query}`, { method: "GET" });
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
  delete: (attendanceId: number, data: any) => {
    return fetchApi(`/attendance/${attendanceId}`, {
      method: "DELETE",
      body: JSON.stringify(data),
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
  getList: () => fetchApi("/coach/list?role=manager", { method: "GET" }),
  getDays: () => fetchApi("/coach/days?role=manager", { method: "GET" }),
  getTimes: () => fetchApi("/coach/times?role=manager", { method: "GET" }),
  getAvailability: (coachId: number, role = "manager", loggedCoachId?: number) => {
    const params = new URLSearchParams({ role, coach_id: String(coachId) });
    if (loggedCoachId) params.set("logged_coach_id", String(loggedCoachId));
    return fetchApi(`/coach/availability?${params.toString()}`, { method: "GET" });
  },
  setup: (data: any) => fetchApi("/coach/setup", { method: "POST", body: JSON.stringify(data) }),
};
