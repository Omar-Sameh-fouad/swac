// مسار الملف: src/components/CoachScreens.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useSignupDraft } from "@/core/SignupContext";
import { scheduleDays, scheduleHours, type CoachSignupDraft } from "@/core/types";
import { BackButton, ScreenShell, FormField, GenderSelector, SignupSubmitButton } from "./SharedUI";
import { submitCoachSignupDraft, CoachAPI, ScheduleAPI, clearSession, getSessionUser } from "@/core/api";

// ... (باقي الدوال المساعدة كما هي: MenuIcon, ProfileIcon, LogoutIcon, ArrowRightIcon, BackArrowIcon, CoachScheduleTable, ClassesScheduleTable, CoachHomeScreen, CoachMenuScreen)

export function CoachScheduleScreen({ onBack, onDone }: { onBack?: () => void; onDone?: () => void; }) {
  const router = useRouter();
  const { coachDraft, setRole, updateCoachDraft } = useSignupDraft();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { workingDays: coachDraft.workingDays } });

  function handleBack() { if (onBack) onBack(); else router.back(); }
  function handleDone() { router.push("/coach/hours"); } // إجبار التوجيه لشاشة الساعات

  return (
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative grid min-h-screen w-full grid-cols-[minmax(0,1fr)_minmax(360px,1fr)] overflow-hidden bg-[#dbe9ef] max-md:grid-cols-1">
        <BackButton onClick={handleBack} />
        <div className="relative min-h-screen overflow-hidden bg-[#cfe5ed] max-md:min-h-[38vh]">
          <Image src="/images/coach-schedule-hero.png" alt="Swimming coaches beside a pool" fill priority sizes="(max-width: 768px) 100vw, 53vw" className="object-contain object-center opacity-65" />
        </div>
        <form onSubmit={handleSubmit((values) => { setRole("coach"); updateCoachDraft({ workingDays: values.workingDays }); handleDone(); })} className="flex min-h-screen flex-col px-[clamp(48px,6.9vw,92px)] pt-[17.5vh] max-md:min-h-0 max-md:px-[10vw] max-md:py-[6vh]">
          <h1 className="text-[clamp(20px,2.1vw,30px)] font-black leading-none">Welcome Coach</h1>
          <p className="mt-[1.5vh] max-w-[220px] text-[clamp(12px,0.82vw,13px)] font-bold leading-[1.25] text-[#108bad]">Please choose your working days</p>
          <fieldset className="mt-[7.3vh] grid w-full max-w-[300px] grid-cols-2 gap-x-[clamp(36px,7vw,96px)] gap-y-4 max-md:mt-[4vh]">
            <legend className="sr-only">Working days</legend>
            {scheduleDays.map((day) => (
              <label key={day} className="flex min-h-[36px] items-center gap-[8px] text-[clamp(12px,0.9vw,13px)] font-bold md:min-h-0">
                <input type="checkbox" value={day} {...register("workingDays", { validate: (v) => v.length > 0 || "Please select at least one working day." })} className="h-[18px] w-[18px] accent-[#108bad] md:h-[clamp(10px,1.15vw,14px)] md:w-[clamp(10px,1.15vw,14px)]" /><span>{day}</span>
              </label>
            ))}
          </fieldset>
          {errors.workingDays && <p className="mt-3 max-w-[300px] text-[clamp(10px,1.25vh,12px)] font-bold leading-snug text-[#c0392b]">{errors.workingDays.message}</p>}
          <button type="submit" className="ml-[clamp(48px,7vw,96px)] mt-[7.5vh] min-h-[44px] w-[clamp(112px,11vw,132px)] rounded-full bg-[#108bad] text-[clamp(12px,0.85vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a] max-md:ml-0 max-md:mt-[5vh]">Next</button>
        </form>
      </section>
    </main>
  );
}

export function CoachHoursScreen({ onBack, onDone }: { onBack?: () => void; onDone?: () => void; }) {
  const router = useRouter();
  const { coachDraft, setRole, updateCoachDraft } = useSignupDraft();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { workingHours: coachDraft.workingHours } });
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(values: any) {
    setIsSaving(true);
    try {
      setRole("coach");
      updateCoachDraft({ workingHours: values.workingHours });
      
      await CoachAPI.setup({
        days: coachDraft.workingDays,
        times: values.workingHours,
      });

      router.push("/coach/home"); // توجيه إجباري للرئيسية بعد حفظ المواعيد
    } catch (err: any) {
      console.error("Failed to save schedule:", err);
      alert(err.message || "Failed to save schedule to server.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    // ... (نفس شاشة الساعات السابقة مع تعديل دالة onSubmit)
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative grid min-h-screen w-full grid-cols-[minmax(0,1fr)_minmax(360px,1fr)] overflow-hidden bg-[#dbe9ef] max-md:grid-cols-1">
        <BackButton onClick={() => router.back()} />
        <div className="relative min-h-screen overflow-hidden bg-[#cfe5ed] max-md:min-h-[38vh]">
          <Image src="/images/coach-schedule-hero.png" alt="Swimming coaches beside a pool" fill priority sizes="(max-width: 768px) 100vw, 53vw" className="object-contain object-center opacity-65" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-screen flex-col px-[clamp(48px,6.9vw,92px)] pt-[17.5vh] max-md:min-h-0 max-md:px-[10vw] max-md:py-[6vh]">
          <h1 className="text-[clamp(20px,2.1vw,30px)] font-black leading-none">Welcome Coach</h1>
          <p className="mt-[1.5vh] max-w-[220px] text-[clamp(12px,0.82vw,13px)] font-bold leading-[1.25] text-[#108bad]">Please choose your working hours of classes</p>
          <fieldset className="mt-[7.3vh] grid w-full max-w-[300px] grid-cols-2 gap-x-[clamp(36px,7vw,96px)] gap-y-4 max-md:mt-[4vh]">
            <legend className="sr-only">Working hours</legend>
            {scheduleHours.map((hour) => (
              <label key={hour} className="flex min-h-[36px] items-center gap-[8px] text-[clamp(12px,0.9vw,13px)] font-bold md:min-h-0">
                <input type="checkbox" value={hour} {...register("workingHours", { validate: (v) => v.length > 0 || "Please select at least one working hour." })} className="h-[18px] w-[18px] accent-[#108bad] md:h-[clamp(10px,1.15vw,14px)] md:w-[clamp(10px,1.15vw,14px)]" /><span>{hour}</span>
              </label>
            ))}
          </fieldset>
          {errors.workingHours && <p className="mt-3 max-w-[300px] text-[clamp(10px,1.25vh,12px)] font-bold leading-snug text-[#c0392b]">{errors.workingHours.message}</p>}
          <button type="submit" disabled={isSaving} className="ml-[clamp(48px,7vw,96px)] mt-[7.5vh] min-h-[44px] w-[clamp(112px,11vw,132px)] rounded-full bg-[#108bad] text-[clamp(12px,0.85vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a] max-md:ml-0 max-md:mt-[5vh] disabled:opacity-60">
            {isSaving ? "Saving..." : "Done"}
          </button>
        </form>
      </section>
    </main>
  );
}

export function CoachSignupForm({ onComplete }: { onComplete?: () => void }) {
  const { coachDraft, setRole, updateCoachDraft } = useSignupDraft();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  const { register, handleSubmit, control, formState: { errors } } = useForm<Pick<CoachSignupDraft, "firstName" | "lastName" | "gender" | "phone" | "email" | "password" | "confirmPassword">>({
    defaultValues: { firstName: coachDraft.firstName, lastName: coachDraft.lastName, gender: coachDraft.gender, phone: coachDraft.phone, email: coachDraft.email, password: coachDraft.password, confirmPassword: coachDraft.confirmPassword },
  });
  const password = useWatch({ control, name: "password" }) ?? "";
  const confirmPassword = useWatch({ control, name: "confirmPassword" }) ?? "";
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function onSubmit(values: any) {
    setApiError("");
    setIsLoading(true);
    try {
      setRole("coach");
      updateCoachDraft(values);
      
      // هنا التسجيل فقط، بدون توجيه للـ login
      await submitCoachSignupDraft({ ...coachDraft, ...values, workingDays: [], workingHours: [], role: "coach" } as any);
      
      // توجيه مباشر لشاشة الأيام
      router.push("/coach/schedule"); 
    } catch (error: any) {
      setApiError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-[min(56vw,650px)] px-0 pb-10 pt-[13.2vh] text-black max-md:w-[82vw] max-md:pt-[12vh]">
      <CoachSignupHeader />
      <div className="grid grid-cols-2 gap-[clamp(34px,10.5vw,118px)] max-md:grid-cols-1 max-md:gap-[2vh]">
        <FormField label="First name" name="firstName" registration={register("firstName", { required: "First name is required." })} message={errors.firstName?.message} messageTone="error" />
        <FormField label="Last name" name="lastName" registration={register("lastName", { required: "Last name is required." })} message={errors.lastName?.message} messageTone="error" />
      </div>
      <GenderSelector registration={register("gender", { required: "Gender is required." })} error={errors.gender?.message} />
      <div className="mt-[2.2vh] space-y-[2.25vh]">
        <FormField label="Phone" name="phone" type="tel" registration={register("phone", { required: "Phone is required." })} message={errors.phone?.message} messageTone="error" />
        <FormField label="Email" name="email" type="email" registration={register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address." } })} message={errors.email?.message} messageTone="error" />
        <FormField label="Create password" name="password" type="password" autoComplete="new-password" registration={register("password", { required: "Password is required.", minLength: { value: 6, message: "Password must be at least 6 characters." } })} message={errors.password?.message} messageTone="error" />
        <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" registration={register("confirmPassword", { required: "Please confirm your password.", validate: (value) => value === password || "Passwords do not match." })} message={errors.confirmPassword?.message ?? (passwordMismatch ? "Passwords do not match" : passwordsMatch ? "Passwords match" : undefined)} messageTone={errors.confirmPassword ? "error" : (passwordMismatch ? "error" : passwordsMatch ? "success" : undefined)} />
      </div>
      {apiError && <p className="mt-3 text-center text-[clamp(10px,1.25vh,12px)] font-bold text-[#c0392b]">{apiError}</p>}
      <SignupSubmitButton label={isLoading ? "Processing..." : "continue"} />
    </form>
  );
}

// ... (باقي المكونات: CoachSignupScreen)