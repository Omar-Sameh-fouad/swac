
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useSignupDraft } from "@/core/SignupContext";
import { scheduleDays, scheduleHours, type CoachSignupDraft } from "@/core/types";
import { BackButton, ScreenShell, FormField, GenderSelector, SignupSubmitButton } from "./SharedUI";
import { submitCoachSignupDraft, CoachAPI, ScheduleAPI, clearSession, getSessionUser } from "@/core/api";

function MenuIcon() { return <svg viewBox="0 0 24 24" className="h-[54%] w-[54%]" aria-hidden><path d="M5.5 7.5h13M5.5 12h13M5.5 16.5h13" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>; }
function ProfileIcon() { return <svg viewBox="0 0 24 24" className="h-[68%] w-[68%]" aria-hidden><circle cx="12" cy="8" r="3.1" fill="white" /><path d="M5.8 19.2c.7-3.6 3-5.4 6.2-5.4s5.5 1.8 6.2 5.4" fill="white" /></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden><path d="M13 5h5v14h-5M8 8l-4 4 4 4M4 12h11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function ArrowRightIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BackArrowIcon() { return <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" aria-hidden><path d="M14.5 6 8.5 12l6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" /></svg>; }

function CoachScheduleTable({ days, hours }: { days: string[]; hours: string[]; }) {
  const rowCount = Math.max(days.length, hours.length, 4);
  const rows = Array.from({ length: rowCount }, (_, index) => ({ day: days[index] ?? "", hour: hours[index] ?? "" }));
  return (
    <div className="overflow-x-auto"><table className="h-[250px] w-full min-w-[470px] table-fixed border-collapse text-center"><thead><tr><th className="h-8 border border-black/70 text-[18px] font-black">Day</th><th className="h-8 border border-black/70 text-[18px] font-black">Time</th></tr></thead><tbody>{rows.map((row, index) => (<tr key={index}><td className="border border-black/70 text-sm font-bold">{row.day}</td><td className="border border-black/70 text-sm font-bold">{row.hour}</td></tr>))}</tbody></table></div>
  );
}

function ClassesScheduleTable({ data = [] }: { data?: any[] }) {
  const displayRows = data.length > 0 ? data : Array.from({ length: 6 }).map(() => ({}));
  return (
    <div className="overflow-x-auto">
      <table className="h-[355px] w-full min-w-[680px] table-fixed border-collapse text-center">
        <thead>
          <tr>
            {["Day", "Time", "Gender", "Name", "Age", "Level"].map((heading) => (
              <th key={heading} className="h-10 border border-black/70 text-[16px] font-black">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row: any, index) => (
            <tr key={index}>
              <td className="border border-black/70 text-sm font-bold">{row.day || ""}</td>
              <td className="border border-black/70 text-sm font-bold">{row.time || ""}</td>
              <td className="border border-black/70 text-sm font-bold">{row.gender || ""}</td>
              <td className="border border-black/70 text-sm font-bold">{row.name || ""}</td>
              <td className="border border-black/70 text-sm font-bold">{row.age || ""}</td>
              <td className="border border-black/70 text-sm font-bold">{row.level || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CoachHomeScreen() {
  const router = useRouter();
  const { coachDraft } = useSignupDraft();

  const sessionUser = typeof window !== "undefined" ? getSessionUser() : null;
  const fName = coachDraft.firstName || sessionUser?.first_name || "";
  const lName = coachDraft.lastName || sessionUser?.last_name || "";
  const coachName = [fName, lName].filter(Boolean).join(" ") || "Coach";

  const [teamDays, setTeamDays] = useState<string[]>([]);
  const [teamHours, setTeamHours] = useState<string[]>([]);
  const [classesData, setClassesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [availRes, schedRes] = await Promise.all([
          CoachAPI.getAvailability().catch(() => null),
          ScheduleAPI.getSchedule().catch(() => null)
        ]);

        if (availRes?.data) {
          const days = [...new Set(availRes.data.map((a: any) => a.working_day))];
          const times = [...new Set(availRes.data.map((a: any) => a.working_time))];
          setTeamDays(days as string[]);
          setTeamHours(times as string[]);
        }

        if (schedRes?.data?.classes_schedule) {
          setClassesData(schedRes.data.classes_schedule);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto grid min-h-screen w-full max-w-[1728px] grid-cols-[52%_48%] px-[clamp(28px,4vw,68px)] py-[clamp(34px,6vh,60px)] max-lg:grid-cols-1 max-lg:gap-10 max-md:px-5">
        <button type="button" onClick={() => router.push("/coach/menu")} aria-label="Open menu" className="absolute left-[clamp(20px,4vw,68px)] top-[clamp(24px,5.6vh,60px)] z-20 flex h-[72px] w-[58px] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a] max-md:h-[54px] max-md:w-[54px]"><MenuIcon /></button>
        <button type="button" onClick={() => router.push("/profile")} aria-label="Open profile" className="absolute right-[clamp(20px,4.8vw,78px)] top-[clamp(24px,5.8vh,62px)] z-20 flex h-[66px] w-[50px] items-center justify-center rounded-full bg-[#b8c2c2] text-white shadow-[0_8px_14px_-13px_rgba(0,0,0,0.75)] transition hover:bg-[#aab5b5] max-md:h-[52px] max-md:w-[52px]"><ProfileIcon /></button>
        <div className="flex min-h-[calc(100vh-120px)] flex-col justify-center pt-20 max-lg:min-h-0">
          <header className="ml-[clamp(28px,4vw,58px)] max-md:ml-0"><h1 className="text-[clamp(30px,2.2vw,38px)] font-black leading-none">Home</h1><p className="mt-2 text-[clamp(22px,1.65vw,26px)] font-black leading-none text-[#108bad]">Welcome Coach</p><p className="mt-2 text-[clamp(15px,1.2vw,18px)] font-black leading-none text-black/30">{coachName}</p></header>
          <div className="relative mt-8 h-[min(62vw,640px)] min-h-[320px] w-full max-lg:h-[52vw] max-md:h-[64vw] max-md:min-h-[260px]"><Image src="/images/swim-master-logo-clean.png" alt="Swim Master logo" fill priority sizes="(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 48vw" className="object-contain object-center" /></div>
        </div>
        <div className="flex min-h-[calc(100vh-120px)] flex-col justify-center gap-[clamp(32px,5vh,46px)] pt-20 max-lg:min-h-0 max-lg:pt-0">
          <section>
            <h2 className="mb-7 text-[clamp(22px,1.7vw,26px)] font-black leading-tight">Your team&apos;s schedule is ...</h2>
            <CoachScheduleTable days={teamDays} hours={teamHours} />
          </section>
          <section>
            <h2 className="mb-5 text-[clamp(22px,1.7vw,26px)] font-black leading-tight">Your classes schedule is ...</h2>
            {isLoading ? (
               <div className="flex h-[355px] items-center justify-center border border-black/70 bg-white/50"><p className="text-lg font-bold text-black/50">Loading schedule...</p></div>
            ) : (
               <ClassesScheduleTable data={classesData} />
            )}
          </section>
          <button type="button" onClick={() => router.push("/coach/schedule")} className="mx-auto flex min-h-[44px] w-[182px] items-center justify-center rounded-full bg-[#108bad] text-sm font-black text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]">Edit</button>
        </div>
      </section>
    </main>
  );
}

export function CoachMenuScreen() {
  const router = useRouter();
  const { resetSignupDraft } = useSignupDraft();

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto grid min-h-screen w-full max-w-[1728px] grid-cols-[62%_38%] px-[clamp(28px,4vw,68px)] py-[clamp(34px,5.6vh,60px)] max-lg:grid-cols-1 max-lg:gap-10 max-md:px-5">
        <button type="button" onClick={() => router.push("/coach/home")} aria-label="Back to coach home" className="absolute left-[clamp(28px,3.7vw,70px)] top-[clamp(26px,5.4vh,58px)] z-30 flex h-[54px] w-[58px] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]"><BackArrowIcon /></button>
        <div className="flex min-h-[calc(100vh-120px)] flex-col justify-center pt-16 max-lg:min-h-0">
          <h1 className="ml-[clamp(72px,8vw,100px)] text-[clamp(30px,2.3vw,36px)] font-black leading-none max-md:ml-0">Menu</h1>
          <div className="relative mt-10 h-[min(42vw,620px)] min-h-[320px] w-full max-lg:h-[48vw] max-md:h-[62vw] max-md:min-h-[260px]"><Image src="/images/swimmer-role-new.jpg" alt="Swimmer in the pool" fill priority sizes="(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 58vw" className="object-contain object-center opacity-85" /></div>
        </div>
        <div className="flex min-h-[calc(100vh-120px)] items-center border-l-4 border-black/45 pl-[clamp(54px,7vw,150px)] max-lg:min-h-0 max-lg:border-l-0 max-lg:border-t-2 max-lg:py-10 max-lg:pl-0">
          <div className="flex w-full flex-col items-center gap-8">
            <button type="button" onClick={() => router.push("/coach/home")} className="flex h-[82px] w-[282px] items-center justify-center gap-3 rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_10px_18px_-15px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"><span>Home</span><ArrowRightIcon /></button>
            <button type="button" onClick={() => router.push("/settings")} className="flex h-[82px] w-[282px] items-center justify-center gap-3 rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_10px_18px_-15px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"><span>settings</span><ArrowRightIcon /></button>
            <button
              type="button"
              onClick={() => {
                resetSignupDraft();
                clearSession();
                router.push("/login");
              }}
              className="flex h-[82px] w-[282px] items-center justify-center gap-3 rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_10px_18px_-15px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"
            >
              <span className="text-red-600">log out</span><span className="text-red-600"><LogoutIcon /></span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function CoachScheduleScreen({ onBack, onDone }: { onBack?: () => void; onDone?: () => void; }) {
  const router = useRouter();
  const { coachDraft, setRole, updateCoachDraft } = useSignupDraft();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { workingDays: coachDraft.workingDays } });

  function handleBack() { if (onBack) onBack(); else router.back(); }
  function handleDone() { if (onDone) onDone(); else router.push("/coach/hours"); }

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

  function handleBack() { if (onBack) onBack(); else router.back(); }
  function handleDone() { if (onDone) onDone(); else router.push("/coach/home"); }

  async function onSubmit(values: any) {
    setIsSaving(true);
    try {
      setRole("coach");
      
      // حفظ الساعات في الـ Context
      updateCoachDraft({ workingHours: values.workingHours });

      // تجميع كل بيانات المدرب اللي اتسجلت في الخطوات السابقة + الخطوة الحالية
      const fullPayload = {
        ...coachDraft,
        workingHours: values.workingHours,
        role: "coach" as const,
      };

      // إرسال البيانات للـ API (الدالة دي بتكريت الحساب، وبتعمل لوجن عشان تاخد التوكن، وبتبعت الجدول في خطوة واحدة)
      await submitCoachSignupDraft(fullPayload);

      handleDone();
    } catch (err: any) {
      console.error("Failed to save schedule:", err);
      alert(err.message || "Failed to save schedule to server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative grid min-h-screen w-full grid-cols-[minmax(0,1fr)_minmax(360px,1fr)] overflow-hidden bg-[#dbe9ef] max-md:grid-cols-1">
        <BackButton onClick={handleBack} />
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

export function CoachSignupHeader() {
  return (
    <header className="mb-[8.4vh] max-md:mb-[5vh]"><h1 className="text-[clamp(20px,3.6vh,34px)] font-black leading-none text-black">Hello Coach</h1><p className="mt-[0.7vh] text-[clamp(10px,1.75vh,16px)] font-semibold leading-none text-[#c8c8c8]">Create your account</p></header>
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
      
      // حفظ البيانات الأساسية في الـ Context فقط وتوجيهه لخطوة اختيار الأيام
      updateCoachDraft(values);
      router.push("/coach/schedule"); 
      
    } catch (error: any) {
      setApiError(error.message || "Something went wrong. Please try again.");
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

export function CoachSignupScreen({ onBack, onComplete }: { onBack: () => void; onComplete?: () => void; }) {
  return (
    <ScreenShell>
      <BackButton onClick={onBack} />
      <CoachSignupForm onComplete={onComplete} />
    </ScreenShell>
  );
}