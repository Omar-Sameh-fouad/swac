// مسار الملف: src/components/AuthScreens.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { useSignupDraft } from "@/core/SignupContext";
import type { CoachSignupDraft } from "@/core/types";
import { BackButton, ScreenShell, EyeIcon, EyeOffIcon, GoogleIcon, FacebookIcon } from "./SharedUI";
import { loginUser } from "@/core/api";

// ==========================================
// 1. LOGIN COMPONENTS
// ==========================================
export function LoginTextField({ label, name, type = "text", autoComplete, required = false, registration }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean; registration?: UseFormRegisterReturn; }) {
  return (
    <label className="mb-[2.12vh] block max-md:mb-[1.4vh]">
      <span className="mb-[1.06vh] block text-[clamp(7px,1.38vh,14px)] font-bold lowercase leading-none">{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required={required} {...registration} className="block min-h-[40px] w-full rounded-full border border-[#a9a9a9] bg-transparent px-3 text-[clamp(12px,1.59vh,16px)] outline-none focus:border-[#168cac] focus:ring-1 focus:ring-[#168cac]/20 md:min-h-[clamp(13px,3.45vh,36px)]" />
    </label>
  );
}

export function LoginPasswordField({ isVisible, onToggleVisibility, required = false, registration }: { isVisible: boolean; onToggleVisibility: () => void; required?: boolean; registration?: UseFormRegisterReturn; }) {
  return (
    <label className="mb-[1.06vh] block">
      <span className="mb-[1.06vh] block text-[clamp(7px,1.38vh,14px)] font-bold lowercase leading-none">password</span>
      <span className="relative block">
        <input name="password" type={isVisible ? "text" : "password"} autoComplete="current-password" required={required} {...registration} className="block min-h-[40px] w-full rounded-full border border-[#a9a9a9] bg-transparent px-3 pr-10 text-[clamp(12px,1.59vh,16px)] outline-none focus:border-[#168cac] focus:ring-1 focus:ring-[#168cac]/20 md:min-h-[clamp(13px,3.45vh,36px)]" />
        <button type="button" aria-label={isVisible ? "Hide password" : "Show password"} onClick={onToggleVisibility} className="absolute right-3 top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center text-[#8b8b8b]">
          {isVisible ? <EyeOffIcon className="h-full w-full" /> : <EyeIcon className="h-full w-full" />}
        </button>
      </span>
    </label>
  );
}

export function LoginActions({ message, messageTone, onForgotPassword, onSignUp }: { message?: string; messageTone?: "error" | "success" | "info"; onForgotPassword: () => void; onSignUp: () => void; }) {
  const messageColor =
    messageTone === "error" ? "text-red-600" :
    messageTone === "success" ? "text-[#108bad]" :
    "text-[#108bad]";
  return (
    <>
      <button type="button" onClick={onForgotPassword} className="mb-[3.7vh] block w-full text-right text-[clamp(4px,1.06vh,11px)] font-medium capitalize leading-none text-[#8c8c8c] max-md:mb-[2.2vh]">forget password</button>
      {message && <p className={`mb-[1.4vh] text-center text-[clamp(9px,1.2vh,12px)] font-bold ${messageColor}`}>{message}</p>}
      <button type="submit" className="mx-auto block min-h-[44px] w-[76%] rounded-full bg-[#108bad] text-[clamp(12px,1.33vh,14px)] font-bold lowercase leading-none text-white shadow-[0_7px_12px_-10px_rgba(0,0,0,0.75)] md:min-h-[clamp(15px,3.98vh,40px)]">login</button>
      <button type="button" onClick={onSignUp} className="mx-auto mt-[2.65vh] block min-h-[44px] w-[76%] rounded-full border border-[#f2f2f2] bg-white text-[clamp(12px,1.33vh,14px)] font-bold lowercase leading-none text-[#108bad] shadow-[0_7px_12px_-11px_rgba(0,0,0,0.75)] max-md:mt-[1.6vh] md:min-h-[clamp(14px,3.71vh,38px)]">sign up</button>
    </>
  );
}

export function LoginHeader() {
  return (
    <header className="mb-[3.45vh] text-center leading-none max-md:mb-[2.2vh]">
      <h1 className="text-[clamp(12px,3.18vh,34px)] font-black lowercase tracking-0">welcome</h1>
      <p className="mt-[0.55vh] text-[clamp(4px,1.06vh,11px)] font-semibold text-[#bebebe]">to swim master</p>
    </header>
  );
}

export function LoginHeroImage() {
  return (
    <div className="absolute left-[7.5vw] top-[6vh] h-[82vh] w-[52vw] max-md:left-1/2 max-md:top-[4vh] max-md:h-[43vh] max-md:w-[88vw] max-md:-translate-x-1/2">
      <Image src="/images/swim-master-logo.jpg" alt="Swim Master" fill priority sizes="(max-width: 768px) 88vw, 52vw" className="object-contain" />
    </div>
  );
}

export function LoginSocialSection() {
  return (
    <>
      <div className="mt-[3.18vh] flex items-center gap-[1.15vw] px-[12%] text-[clamp(4px,1.06vh,11px)] font-semibold lowercase leading-none text-[#202020] max-md:mt-[2vh]">
        <span className="h-px flex-1 bg-[#8f8f8f]" /><span>or</span><span className="h-px flex-1 bg-[#8f8f8f]" />
      </div>
      <p className="mt-[1.86vh] text-center text-[clamp(4px,1.06vh,11px)] font-medium lowercase leading-none text-[#8b8b8b]">login with</p>
      <div className="mt-[1.59vh] flex items-center justify-center gap-[1.65vw]">
        <a href="https://accounts.google.com/signin" target="_blank" rel="noreferrer" aria-label="Continue with Google" className="flex h-[clamp(13px,3.45vh,34px)] w-[clamp(13px,3.45vh,34px)] items-center justify-center"><GoogleIcon className="h-[92%] w-[92%]" /></a>
        <a href="https://www.facebook.com/login/" target="_blank" rel="noreferrer" aria-label="Continue with Facebook" className="flex h-[clamp(13px,3.45vh,34px)] w-[clamp(13px,3.45vh,34px)] items-center justify-center"><FacebookIcon className="h-[92%] w-[92%]" /></a>
      </div>
    </>
  );
}

// --- LoginForm مربوط بالـ API ---
export function LoginForm({ onSignIn, onSignUp }: { onSignIn: (role: string) => void; onSignUp: () => void; }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success" | "info">("info");
  const [isLoading, setIsLoading] = useState(false);
  const { setRole, updateCoachDraft, updateSwimmerDraft } = useSignupDraft();

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await loginUser({ email: username, password });

      // حفظ التوكن في localStorage
      if (response.token || response.access_token) {
        localStorage.setItem("authToken", response.token || response.access_token);
      }

      // استخراج بيانات المستخدم وتحديد الدور
      const user = response.user || response;
      const role: string = user.role || "swimmer";

      setRole(role as "swimmer" | "coach" | "manager");

      // تعبئة الـ context ببيانات المستخدم الحقيقية
      if (role === "swimmer") {
        updateSwimmerDraft({
          id: user.id,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          gender: user.gender || "",
          age: user.age?.toString() || "",
          phone: user.phone || "",
          level: user.level || "",
          email: user.email || "",
        });
      } else if (role === "coach") {
        updateCoachDraft({
          id: user.id,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          gender: user.gender || "",
          phone: user.phone || "",
          email: user.email || "",
        });
      }

      setMessage("Login successful!");
      setMessageTone("success");
      onSignIn(role);
    } catch (error: any) {
      setMessage(error.message || "Login failed. Please check your credentials.");
      setMessageTone("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleLoginSubmit} className="absolute left-[61.8vw] top-[22.3vh] w-[21.9vw] min-w-[133px] max-w-[360px] text-[#0b0b0b] max-md:left-1/2 max-md:top-[53vh] max-md:w-[64vw] max-md:max-w-[280px] max-md:-translate-x-1/2">
      <LoginHeader />
      <LoginTextField label="username" name="username" autoComplete="username" required />
      <LoginPasswordField isVisible={isPasswordVisible} required onToggleVisibility={() => setIsPasswordVisible((current) => !current)} />
      <LoginActions
        message={isLoading ? "Logging in..." : message}
        messageTone={messageTone}
        onForgotPassword={() => { setMessage("Please ask the academy manager to reset your password."); setMessageTone("info"); }}
        onSignUp={onSignUp}
      />
      <LoginSocialSection />
    </form>
  );
}

export function LoginScreen({ onSignIn, onSignUp }: { onSignIn: (role: string) => void; onSignUp: () => void; }) {
  return (
    <ScreenShell>
      <LoginHeroImage />
      <LoginForm onSignIn={onSignIn} onSignUp={onSignUp} />
    </ScreenShell>
  );
}

// ==========================================
// 2. ROLE SELECTION COMPONENTS
// ==========================================
export function RoleButton({ label, onClick }: { label: string; onClick?: () => void; }) {
  return (
    <button type="button" onClick={onClick} className="min-h-[44px] w-[clamp(124px,15.6vw,190px)] rounded-full bg-white text-[clamp(12px,1.45vh,14px)] font-extrabold text-[#095775] shadow-[0_8px_18px_-14px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:bg-[#f7fdff] md:min-h-[clamp(20px,4.25vh,42px)]">{label}</button>
  );
}

export function RoleGreeting() {
  return (
    <h1 className="absolute left-[12.1vw] top-[11.8vh] z-20 text-[clamp(13px,2.5vh,24px)] font-black text-black max-md:left-[8vw] max-md:top-[11vh]">Hello!</h1>
  );
}

export function RoleHeroImage() {
  return (
    <div className="absolute left-1/2 top-[15.5vh] h-[69vh] w-[61vw] max-w-[820px] -translate-x-1/2 max-md:top-[17vh] max-md:h-[55vh] max-md:w-[94vw]">
      <Image src="/images/swimmer-role-new.jpg" alt="Swimmer in water" fill priority sizes="(max-width: 768px) 94vw, 61vw" className="object-contain" />
    </div>
  );
}

export function RoleOptions({ onManager, onCoach, onSwimmer }: { onManager: () => void; onCoach: () => void; onSwimmer: () => void; }) {
  return (
    <div className="absolute left-1/2 top-[30vh] z-10 flex -translate-x-1/2 flex-col items-center max-md:top-[33vh]">
      <p className="mb-[1.1vh] text-[clamp(10px,1.9vh,18px)] font-extrabold tracking-0 text-black">I am a ...</p>
      <div className="flex flex-col items-center gap-[clamp(13px,4.2vh,35px)]">
        <RoleButton label="Manager" onClick={onManager} />
        <RoleButton label="Coach" onClick={onCoach} />
        <RoleButton label="Swimmer" onClick={onSwimmer} />
      </div>
    </div>
  );
}

export function RoleSelectionScreen({ onBack, onManager, onCoach, onSwimmer }: { onBack: () => void; onManager: () => void; onCoach: () => void; onSwimmer: () => void; }) {
  return (
    <ScreenShell>
      <BackButton onClick={onBack} />
      <RoleGreeting />
      <RoleHeroImage />
      <RoleOptions onManager={onManager} onCoach={onCoach} onSwimmer={onSwimmer} />
    </ScreenShell>
  );
}

// ==========================================
// 3. PROFILE & SETTINGS COMPONENTS
// ==========================================
function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" aria-hidden>
      <path d="M14.5 6 8.5 12l6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" />
    </svg>
  );
}

function BigProfileIcon() {
  return (
    <svg viewBox="0 0 240 240" className="h-[72%] w-[72%]" aria-hidden>
      <circle cx="120" cy="78" r="34" fill="white" filter="url(#shadow)" />
      <path d="M56 178c7-38 31-56 64-56s57 18 64 56c2 12-7 22-20 22H76c-13 0-22-10-20-22Z" fill="white" filter="url(#shadow)" />
      <defs><filter id="shadow" x="0" y="0" width="240" height="240"><feDropShadow dx="0" dy="8" floodColor="#000000" floodOpacity="0.16" stdDeviation="5" /></filter></defs>
    </svg>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { coachDraft, role, swimmerDraft } = useSignupDraft();
  const activeDraft = role === "swimmer" ? swimmerDraft : coachDraft;
  const username = [activeDraft.firstName, activeDraft.lastName].filter(Boolean).join(" ") || (role === "manager" ? "Manager" : "name");

  const getBackPath = (role: string | null) => {
    if (role === "coach") return "/coach/home";
    if (role === "swimmer") return "/swimmer/home";
    if (role === "manager") return "/manager/home";
    return "/roles";
  };

  const profileRows = role === "swimmer"
    ? [["Username", username], ["Gender", swimmerDraft.gender || "gender"], ["Age", swimmerDraft.age || "age"], ["Phone", swimmerDraft.phone || "phone"], ["Level", swimmerDraft.level || "level"]]
    : role === "manager"
      ? [["Username", "Manager"], ["Gender", "gender"], ["Phone", "phone"], ["Role", "Manager"]]
      : [["Username", username], ["Gender", coachDraft.gender || "gender"], ["Phone", coachDraft.phone || "phone"], ["Role", "Coach"]];

  return (
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative mx-auto grid min-h-screen w-full max-w-[1728px] grid-cols-[42%_58%] px-[clamp(28px,4vw,68px)] py-[clamp(34px,5.6vh,60px)] max-lg:grid-cols-1 max-lg:gap-10 max-md:px-5">
        <button type="button" onClick={() => router.push(getBackPath(role))} aria-label="Back" className="absolute left-[clamp(28px,3.7vw,70px)] top-[clamp(26px,5.4vh,58px)] z-30 flex h-[54px] w-[58px] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]"><BackArrowIcon /></button>
        <div className="flex min-h-[calc(100vh-120px)] flex-col justify-center pt-16 max-lg:min-h-0">
          <h1 className="ml-[clamp(72px,8vw,100px)] text-[clamp(30px,2.3vw,36px)] font-black leading-none max-md:ml-0">Profile</h1>
          <div className="mt-10 flex justify-center"><div className="flex h-[265px] w-[280px] items-center justify-center rounded-full border-4 border-white bg-[#b8c2c2] max-md:h-[210px] max-md:w-[222px]"><BigProfileIcon /></div></div>
        </div>
        <div className="flex min-h-[calc(100vh-120px)] items-center border-l-4 border-black/45 pl-[clamp(90px,9vw,135px)] max-lg:min-h-0 max-lg:border-l-0 max-lg:border-t-2 max-lg:py-10 max-lg:pl-0">
          <dl className="space-y-4 max-lg:mx-auto max-lg:w-full max-lg:max-w-sm">
            {profileRows.map(([label, value]) => (
              <div key={label}><dt className="text-[24px] font-black">{label}</dt><dd className="pb-1 text-[19px] font-semibold text-black/28">{value}</dd></div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}

export function ProfileEditScreen() {
  const router = useRouter();
  const { coachDraft, role, swimmerDraft, updateCoachDraft, updateSwimmerDraft } = useSignupDraft();
  const activeDraft = role === "swimmer" ? swimmerDraft : coachDraft;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Pick<CoachSignupDraft, "firstName" | "lastName" | "gender" | "phone">>({
    defaultValues: { firstName: activeDraft.firstName, lastName: activeDraft.lastName, gender: activeDraft.gender, phone: activeDraft.phone },
  });

  useEffect(() => {
    if (!role) { reset({ firstName: "", lastName: "", gender: "", phone: "" }); return; }
    reset({ firstName: activeDraft.firstName, lastName: activeDraft.lastName, gender: activeDraft.gender, phone: activeDraft.phone });
  }, [activeDraft.firstName, activeDraft.gender, activeDraft.lastName, activeDraft.phone, reset, role]);

  async function onSubmit(values: any) {
    try {
      const userId = role === "swimmer" ? swimmerDraft?.id : coachDraft?.id;
      if (userId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api-academy-production-c1ab.up.railway.app/api"}/auth/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            role,
            first_name: values.firstName,
            last_name: values.lastName,
            gender: values.gender,
            phone: values.phone,
          }),
        });
      }
    } catch {
      // تجاهل الخطأ وحفظ محلياً على أي حال
    }
    if (role === "swimmer") updateSwimmerDraft(values);
    if (role === "coach") updateCoachDraft(values);
    router.push("/profile");
  }

  return (
    <main className="min-h-screen bg-[#dbe9ef] text-black">
      <section className="relative mx-auto flex min-h-screen w-full max-w-[1728px] flex-col px-[clamp(28px,4vw,68px)] py-[clamp(34px,5.6vh,60px)] max-md:px-5">
        <button type="button" onClick={() => router.push("/settings")} aria-label="Back to settings" className="absolute left-[clamp(28px,3.7vw,70px)] top-[clamp(26px,5.4vh,58px)] z-30 flex h-[54px] w-[58px] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]"><BackArrowIcon /></button>
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[520px] flex-col justify-center pt-16">
          <h1 className="mb-9 text-[clamp(30px,2.3vw,36px)] font-black leading-none">Edit profile</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[18px] bg-white/65 p-6 shadow-[0_16px_28px_-24px_rgba(0,0,0,0.8)]">
            <label className="block"><span className="mb-2 block text-sm font-black">First name</span><input type="text" {...register("firstName", { required: "First name is required." })} className="h-12 w-full rounded-full border border-black/25 bg-white px-4 text-base font-semibold outline-none focus:border-[#108bad] focus:ring-2 focus:ring-[#108bad]/20" />{errors.firstName && <p className="mt-1 text-xs font-bold text-[#c0392b]">{errors.firstName.message}</p>}</label>
            <label className="block"><span className="mb-2 block text-sm font-black">Last name</span><input type="text" {...register("lastName", { required: "Last name is required." })} className="h-12 w-full rounded-full border border-black/25 bg-white px-4 text-base font-semibold outline-none focus:border-[#108bad] focus:ring-2 focus:ring-[#108bad]/20" />{errors.lastName && <p className="mt-1 text-xs font-bold text-[#c0392b]">{errors.lastName.message}</p>}</label>
            <fieldset><legend className="mb-3 text-sm font-black">Gender</legend><div className="grid grid-cols-2 gap-4">
              {[{ label: "Male", value: "male" }, { label: "Female", value: "female" }].map((option) => (
                <label key={option.value} className="flex min-h-11 items-center gap-2 text-sm font-black"><input type="radio" value={option.value} {...register("gender", { required: "Gender is required." })} className="h-5 w-5 appearance-none rounded-full border border-[#8d8d8d] bg-white checked:border-[5px] checked:border-[#108bad] focus:outline-none focus:ring-2 focus:ring-[#108bad]/20" />{option.label}</label>
              ))}
            </div>{errors.gender && <p className="mt-1 text-xs font-bold text-[#c0392b]">{errors.gender.message}</p>}</fieldset>
            <label className="block"><span className="mb-2 block text-sm font-black">Phone</span><input type="tel" {...register("phone", { required: "Phone is required." })} className="h-12 w-full rounded-full border border-black/25 bg-white px-4 text-base font-semibold outline-none focus:border-[#108bad] focus:ring-2 focus:ring-[#108bad]/20" />{errors.phone && <p className="mt-1 text-xs font-bold text-[#c0392b]">{errors.phone.message}</p>}</label>
            <button type="submit" className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#108bad] text-sm font-black text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]">Save</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export function SettingsScreen() {
  const router = useRouter();
  const { resetSignupDraft, role, swimmerDraft, coachDraft } = useSignupDraft();

  const getBackPath = (role: string | null) => {
    if (role === "coach") return "/coach/menu";
    if (role === "swimmer") return "/swimmer/home";
    if (role === "manager") return "/manager/home";
    return "/roles";
  };

  async function handleDeleteAccount() {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;
    try {
      const userId = role === "swimmer" ? swimmerDraft?.id : coachDraft?.id;
      if (userId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api-academy-production-c1ab.up.railway.app/api"}/auth/profile`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, role }),
        });
      }
    } catch {
      // تجاهل الخطأ وننهي الجلسة على أي حال
    } finally {
      resetSignupDraft();
      localStorage.removeItem("authToken");
      router.replace("/login");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffef8] text-black">
      <div className="absolute inset-y-0 left-0 w-[18%] bg-[#fbfaf1] max-md:hidden" />
      <section className="relative mx-auto min-h-screen w-full max-w-[1728px] px-[clamp(28px,4vw,68px)] py-[clamp(34px,5.6vh,60px)] max-md:px-5">
        <button type="button" onClick={() => router.push(getBackPath(role))} aria-label="Back" className="absolute left-[clamp(28px,3.7vw,70px)] top-[clamp(26px,5.4vh,58px)] z-30 flex h-[54px] w-[58px] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]"><BackArrowIcon /></button>
        <h1 className="ml-[clamp(92px,11vw,150px)] pt-[clamp(48px,6vh,58px)] text-[clamp(30px,2.3vw,36px)] font-black leading-none max-md:ml-0 max-md:pt-20">Settings</h1>
        <div className="relative flex min-h-[calc(100vh-178px)] items-center justify-center py-10">
          <div className="absolute left-1/2 top-1/2 h-[min(56vw,650px)] min-h-[360px] w-[min(68vw,980px)] -translate-x-1/2 -translate-y-1/2 max-lg:h-[56vw] max-lg:w-[86vw] max-md:h-[62vh] max-md:min-h-[390px] max-md:w-[115vw]"><Image src="/images/swimmer-table-bg-removebg-preview.png" alt="Swimmer background" fill priority sizes="(max-width: 768px) 115vw, (max-width: 1024px) 86vw, 68vw" className="object-contain object-center opacity-80" /></div>
          <div className="relative z-10 flex w-full flex-col items-center gap-[clamp(24px,4.8vh,54px)]">
            <button type="button" onClick={() => router.push("/booking")} className="flex h-[80px] w-[282px] items-center justify-center rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_12px_18px_-14px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]">Booking</button>
            <button type="button" onClick={() => router.push("/profile/edit")} className="flex h-[80px] w-[282px] items-center justify-center rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_12px_18px_-14px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]">Edit profile</button>
            <button type="button" onClick={() => router.push("/attendance")} className="flex h-[80px] w-[282px] items-center justify-center rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_12px_18px_-14px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]">Attendance</button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex h-[80px] w-[282px] items-center justify-center rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_12px_18px_-14px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"
            >
              Delete account
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
