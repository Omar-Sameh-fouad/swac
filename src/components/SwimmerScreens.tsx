// مسار الملف: src/components/SwimmerScreens.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useSignupDraft } from "@/core/SignupContext";
import { scheduleDays, scheduleHours, type SwimmerSignupDraft } from "@/core/types";
import { getSwimmerPostSignupRoute } from "@/core/signupFlow.mjs";
import { BackButton, ScreenShell, FormField, GenderSelector, SignupSubmitButton } from "./SharedUI";
import { submitSwimmerSignupDraft, ScheduleAPI, getSessionUser } from "@/core/api";

type TrainingScheduleRow = {
  day?: string;
  time?: string;
};

type SwimmerSignupValues = Pick<SwimmerSignupDraft, "firstName" | "lastName" | "gender" | "age" | "phone" | "level" | "email" | "password" | "confirmPassword">;

function SmallProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <circle cx="12" cy="8" r="3.3" fill="white" />
      <path d="M5.5 19c.8-3.8 3.2-5.7 6.5-5.7s5.7 1.9 6.5 5.7" fill="white" />
    </svg>
  );
}

export function SwimmerHomeScreen() {
  const router = useRouter();
  const { swimmerDraft } = useSignupDraft();
  
  // ✅ حل اختفاء البيانات: القراءة المباشرة من المتغيرات
  const sessionUser = typeof window !== "undefined" ? getSessionUser() : null;
  const fName = swimmerDraft.firstName || sessionUser?.first_name || "";
  const lName = swimmerDraft.lastName || sessionUser?.last_name || "";
  const swimmerName = [fName, lName].filter(Boolean).join(" ");
  const ageDisplay = swimmerDraft.age || sessionUser?.age || "-";
  const levelDisplay = swimmerDraft.level || sessionUser?.level || "-";
  
  const [scheduleList, setScheduleList] = useState<TrainingScheduleRow[]>([]);
  const [assignedCoach, setAssignedCoach] = useState<string>("Not assigned yet");

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await ScheduleAPI.getSchedule();
        if (res?.data?.schedule) setScheduleList(res.data.schedule);
        if (res?.data?.coach_name) setAssignedCoach(res.data.coach_name);
      } catch (error) {
        console.error("Failed to load schedule", error);
      }
    }
    loadSchedule();
  }, []);

  const displayRows: TrainingScheduleRow[] = scheduleList.length > 0 ? scheduleList : Array.from({ length: 2 }).map(() => ({}));

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-[clamp(24px,7vw,88px)] py-[clamp(82px,12vh,116px)]">
        <BackButton onClick={() => router.push("/roles")} />
        <button type="button" onClick={() => router.push("/profile")} className="absolute right-[clamp(24px,7vw,88px)] top-[clamp(28px,6vh,58px)] flex h-12 w-12 items-center justify-center rounded-full bg-[#b8c2c2] text-xl font-black text-white" aria-label="Open profile"><SmallProfileIcon /></button>
        <div className="max-w-2xl">
          <p className="text-[clamp(12px,1.1vw,14px)] font-black uppercase text-[#108bad]">Swimmer dashboard</p>
          <h1 className="mt-3 text-[clamp(32px,5vw,58px)] font-black leading-[0.95]">Welcome{swimmerName ? `, ${swimmerName}` : " Swimmer"}</h1>
          <p className="mt-5 max-w-xl text-[clamp(14px,1.4vw,17px)] font-semibold leading-7 text-black/55">Here you can review your training days, selected hours, and booking options.</p>
        </div>
        <div className="mt-[clamp(34px,7vh,72px)] grid gap-6 md:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[8px] border border-[#108bad]/20 bg-white/75 p-6 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.7)]">
            <h2 className="text-[clamp(18px,1.6vw,22px)] font-black text-[#108bad]">Your training schedule is ...</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[360px] border-collapse text-center text-sm font-bold">
                <thead><tr><th className="border border-black/50 px-3 py-3">Day</th><th className="border border-black/50 px-3 py-3">Time</th></tr></thead>
                <tbody>
                  {displayRows.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-black/50 px-3 py-3">{row.day || "-"}</td>
                      <td className="border border-black/50 px-3 py-3">{row.time || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <aside className="grid gap-5">
            <div className="rounded-[8px] border border-[#108bad]/20 bg-white/75 p-6 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.7)]"><h2 className="text-lg font-black text-[#108bad]">Your coach is ...</h2><p className="mt-4 text-sm font-bold text-black/55">{assignedCoach}</p></div>
            <div className="rounded-[8px] border border-[#108bad]/20 bg-white/75 p-6 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.7)]"><h2 className="text-lg font-black text-[#108bad]">Your details</h2><p className="mt-4 text-sm font-bold text-black/55">Age: {ageDisplay}</p><p className="mt-2 text-sm font-bold text-black/55">Level: {levelDisplay}</p></div>
          </aside>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={() => router.push("/swimmer/schedule")} className="min-h-11 w-36 rounded-full bg-[#108bad] text-sm font-black text-white">Edit</button>
          <button type="button" onClick={() => router.push("/booking")} className="min-h-11 w-36 rounded-full border border-[#108bad] bg-white text-sm font-black text-[#108bad]">Booking</button>
        </div>
      </section>
    </main>
  );
}

const maxSelectedDays = 2;

export function SwimmerScheduleScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void; }) {
  const { setRole, swimmerDraft, updateSwimmerDraft } = useSignupDraft();
  const { clearErrors, control, formState: { errors }, handleSubmit, setError, setValue } = useForm({ defaultValues: { trainingDays: swimmerDraft.trainingDays } });
  const selectedDays = useWatch({ control, name: "trainingDays" }) ?? [];

  function toggleDay(day: string) {
    const nextDays = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : selectedDays.length < maxSelectedDays ? [...selectedDays, day] : selectedDays;
    setValue("trainingDays", nextDays, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    if (!errors.trainingDays) return;
    if (nextDays.length === maxSelectedDays) clearErrors("trainingDays");
    else setError("trainingDays", { type: "validate", message: "Please select exactly two training days." });
  }

  return (
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative grid min-h-screen w-full grid-cols-[minmax(0,1fr)_minmax(360px,1fr)] overflow-hidden bg-[#dbe9ef] max-md:grid-cols-1">
        <BackButton onClick={onBack} />
        <div className="relative min-h-screen overflow-hidden bg-[#cfe5ed] max-md:min-h-[38vh]"><Image src="/images/swimmer-schedule-hero.png" alt="Swimmers beside a pool" fill priority sizes="(max-width: 768px) 100vw, 51vw" className="object-contain object-center opacity-65" /></div>
        <form onSubmit={handleSubmit((values) => { if (values.trainingDays.length !== maxSelectedDays) { setError("trainingDays", { type: "validate", message: "Please select exactly two training days." }); return; } setRole("swimmer"); updateSwimmerDraft({ trainingDays: values.trainingDays }); onNext(); })} className="flex min-h-screen flex-col px-[clamp(48px,6.9vw,92px)] pt-[17.5vh] max-md:min-h-0 max-md:px-[10vw] max-md:py-[6vh]">
          <h1 className="text-[clamp(20px,2.1vw,30px)] font-black leading-none">Welcome Swimmer</h1>
          <p className="mt-[1.5vh] max-w-[220px] text-[clamp(12px,0.82vw,13px)] font-bold leading-[1.25] text-[#108bad]">Please choose your training days<span className="block text-[clamp(10px,0.68vw,11px)] text-black/70">two only</span></p>
          <fieldset className="mt-[7.3vh] grid w-full max-w-[300px] grid-cols-2 gap-x-[clamp(36px,7vw,96px)] gap-y-4 max-md:mt-[4vh]">
            <legend className="sr-only">Training days</legend>
            {scheduleDays.map((day) => (
              <label key={day} className="flex min-h-[36px] items-center gap-[8px] text-[clamp(12px,0.9vw,13px)] font-bold md:min-h-0">
                <input type="checkbox" name="trainingDays" value={day} checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} className="h-[18px] w-[18px] accent-[#108bad] md:h-[clamp(10px,1.15vw,14px)] md:w-[clamp(10px,1.15vw,14px)]" /><span>{day}</span>
              </label>
            ))}
          </fieldset>
          {errors.trainingDays && <p className="mt-3 max-w-[300px] text-[clamp(10px,1.25vh,12px)] font-bold leading-snug text-[#c0392b]">{errors.trainingDays.message}</p>}
          <button type="submit" className="ml-[clamp(48px,7vw,96px)] mt-[7.5vh] min-h-[44px] w-[clamp(112px,11vw,132px)] rounded-full bg-[#108bad] text-[clamp(12px,0.85vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a] max-md:ml-0 max-md:mt-[5vh]">Next</button>
        </form>
      </section>
    </main>
  );
}

export function SwimmerHoursScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void; }) {
  const { setRole, swimmerDraft, updateSwimmerDraft } = useSignupDraft();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { trainingHours: swimmerDraft.trainingHours } });

  return (
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative grid min-h-screen w-full grid-cols-[minmax(0,1fr)_minmax(360px,1fr)] overflow-hidden bg-[#dbe9ef] max-md:grid-cols-1">
        <div className="contents [&>button]:left-[3.7vw] [&>button]:top-[5.4vh]"><BackButton onClick={onBack} /></div>
        <div className="relative min-h-screen overflow-hidden bg-[#cfe5ed] max-md:min-h-[38vh]"><Image src="/images/swimmer-schedule-hero.png" alt="Swimmers beside a pool" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-[center_42%] opacity-65" /></div>
        <form onSubmit={handleSubmit((values) => { setRole("swimmer"); updateSwimmerDraft({ trainingHours: values.trainingHours }); onDone(); })} className="flex min-h-screen flex-col px-[clamp(48px,6.9vw,92px)] pt-[17.5vh] max-md:min-h-0 max-md:px-[10vw] max-md:py-[6vh]">
          <h1 className="text-[clamp(20px,2.1vw,30px)] font-black leading-none">Welcome Swimmer</h1>
          <p className="mt-[1.5vh] max-w-[220px] text-[clamp(12px,0.82vw,13px)] font-bold leading-[1.25] text-[#108bad]">Please choose your training hours</p>
          <fieldset className="mt-[7.3vh] grid w-full max-w-[300px] grid-cols-2 gap-x-[clamp(36px,7vw,96px)] gap-y-4 max-md:mt-[4vh]">
            <legend className="sr-only">Training hours</legend>
            {scheduleHours.map((hour) => (
              <label key={hour} className="flex min-h-[36px] items-center gap-[8px] text-[clamp(12px,0.9vw,13px)] font-bold md:min-h-0">
                <input type="checkbox" value={hour} {...register("trainingHours", { validate: (v) => v.length > 0 || "Please select at least one training hour." })} className="h-[18px] w-[18px] accent-[#108bad] md:h-[clamp(10px,1.15vw,14px)] md:w-[clamp(10px,1.15vw,14px)]" /><span>{hour}</span>
              </label>
            ))}
          </fieldset>
          {errors.trainingHours && <p className="mt-3 max-w-[300px] text-[clamp(10px,1.25vh,12px)] font-bold leading-snug text-[#c0392b]">{errors.trainingHours.message}</p>}
          <button type="submit" className="ml-[clamp(48px,7vw,96px)] mt-[7.5vh] min-h-[44px] w-[clamp(112px,11vw,132px)] rounded-full bg-[#108bad] text-[clamp(12px,0.85vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a] max-md:ml-0 max-md:mt-[5vh]">Done</button>
        </form>
      </section>
    </main>
  );
}

export function SwimmerSignupHeader() {
  return (
    <header className="mb-[6.2vh] max-md:mb-[4vh]"><h1 className="text-[clamp(20px,3.6vh,34px)] font-black leading-none text-black">Hello Swimmer</h1><p className="mt-[0.7vh] text-[clamp(10px,1.75vh,16px)] font-semibold leading-none text-[#c8c8c8]">Create your account</p></header>
  );
}

export function SwimmerSignupForm({ onComplete }: { onComplete?: () => void }) {
  const { setRole, swimmerDraft, updateSwimmerDraft } = useSignupDraft();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  const { register, handleSubmit, control, formState: { errors } } = useForm<SwimmerSignupValues>({
    defaultValues: { firstName: swimmerDraft.firstName, lastName: swimmerDraft.lastName, gender: swimmerDraft.gender, age: swimmerDraft.age, phone: swimmerDraft.phone, level: swimmerDraft.level, email: swimmerDraft.email, password: swimmerDraft.password, confirmPassword: swimmerDraft.confirmPassword },
  });
  const password = useWatch({ control, name: "password" }) ?? "";
  const confirmPassword = useWatch({ control, name: "confirmPassword" }) ?? "";
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function onSubmit(values: SwimmerSignupValues) {
    setApiError("");
    setIsLoading(true);
    try {
      setRole("swimmer");
      updateSwimmerDraft(values);
      await submitSwimmerSignupDraft({ ...swimmerDraft, ...values, role: "swimmer" });
      if (onComplete) {
        onComplete();
        return;
      }
      router.push(getSwimmerPostSignupRoute());
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-[min(47vw,540px)] px-0 pb-10 pt-[13.2vh] text-black max-md:w-[82vw] max-md:pt-[10vh]">
      <SwimmerSignupHeader />
      <div className="grid grid-cols-2 gap-[clamp(34px,10.5vw,118px)] max-md:grid-cols-1 max-md:gap-[2vh]">
        <FormField label="First name" name="firstName" registration={register("firstName", { required: "First name is required." })} message={errors.firstName?.message} messageTone="error" />
        <FormField label="Last name" name="lastName" registration={register("lastName", { required: "Last name is required." })} message={errors.lastName?.message} messageTone="error" />
      </div>
      <GenderSelector registration={register("gender", { required: "Gender is required." })} error={errors.gender?.message} />
      <div className="mt-[1.85vh] space-y-[1.65vh]">
        <FormField label="Age" name="age" type="number" registration={register("age", { required: "Age is required.", validate: (value) => { const age = Number(value); return (/^\d+$/.test(value) && age >= 3 && age <= 100) || "Enter a valid age."; } })} message={errors.age?.message} messageTone="error" />
        <FormField label="Phone" name="phone" type="tel" registration={register("phone", { required: "Phone is required." })} message={errors.phone?.message} messageTone="error" />
        <FormField label="Level" name="level" registration={register("level", { required: "Level is required." })} message={errors.level?.message} messageTone="error" />
        <FormField label="Email" name="email" type="email" registration={register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address." } })} message={errors.email?.message} messageTone="error" />
        <FormField label="Create password" name="password" type="password" autoComplete="new-password" registration={register("password", { required: "Password is required.", minLength: { value: 6, message: "Password must be at least 6 characters." } })} message={errors.password?.message} messageTone="error" />
        <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" registration={register("confirmPassword", { required: "Please confirm your password.", validate: (value) => value === password || "Passwords do not match." })} message={errors.confirmPassword?.message ?? (passwordMismatch ? "Passwords do not match" : passwordsMatch ? "Passwords match" : undefined)} messageTone={errors.confirmPassword ? "error" : (passwordMismatch ? "error" : passwordsMatch ? "success" : undefined)} />
      </div>
      {apiError && <p className="mt-3 text-center text-[clamp(10px,1.25vh,12px)] font-bold text-[#c0392b]">{apiError}</p>}
      <SignupSubmitButton label={isLoading ? "Creating account..." : "continue"} />
    </form>
  );
}

export function SwimmerSignupScreen({ onBack, onComplete }: { onBack: () => void; onComplete?: () => void; }) {
  return (
    <ScreenShell>
      <BackButton onClick={onBack} />
      <SwimmerSignupForm onComplete={onComplete} />
    </ScreenShell>
  );
}
