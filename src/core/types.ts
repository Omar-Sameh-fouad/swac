// --- From schedulee.ts ---
export type ScheduleDay = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
export type ScheduleHour = "8 AM" | "9 AM" | "10 AM" | "3 PM" | "4 PM" | "5 PM" | "6 PM";

// --- From schedule.ts ---
export const scheduleDays: ScheduleDay[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
export const scheduleHours: ScheduleHour[] = ["8 AM", "9 AM", "10 AM", "3 PM", "4 PM", "5 PM", "6 PM"];

// --- From user.ts ---
export type SignupRole = "coach" | "swimmer" | "manager";
export type Gender = "male" | "female" | "";

export type CoachSignupDraft = {
  id?: number;

  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  workingDays: string[];
  workingHours: string[];
};

export type SwimmerSignupDraft = {
  id?: number;

  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  level: string;
  trainingDays: string[];
  trainingHours: string[];
};

export type CoachSignupPayload = CoachSignupDraft & {
  role: "coach";
};

export type SwimmerSignupPayload = SwimmerSignupDraft & {
  role: "swimmer";
};// --- From schedulee.ts ---
export type ScheduleDay = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
export type ScheduleHour = "8 AM" | "9 AM" | "10 AM" | "3 PM" | "4 PM" | "5 PM" | "6 PM";

// --- From schedule.ts ---
export const scheduleDays: ScheduleDay[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
export const scheduleHours: ScheduleHour[] = ["8 AM", "9 AM", "10 AM", "3 PM", "4 PM", "5 PM", "6 PM"];

// --- From user.ts ---
export type SignupRole = "coach" | "swimmer" | "manager";
export type Gender = "male" | "female" | "";

export type CoachSignupDraft = {
  id?: number;

  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  workingDays: string[];
  workingHours: string[];
};

export type SwimmerSignupDraft = {
  id?: number;

  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  level: string;
  trainingDays: string[];
  trainingHours: string[];
};

export type CoachSignupPayload = CoachSignupDraft & {
  role: "coach";
};

export type SwimmerSignupPayload = SwimmerSignupDraft & {
  role: "swimmer";
};