// مسار الملف: src/components/SharedUI.tsx
import { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

// --- BackButton ---
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="absolute left-[clamp(28px,3.7vw,70px)] top-[clamp(26px,5.4vh,58px)] z-30 flex h-[clamp(44px,5.1vh,54px)] w-[clamp(44px,5.1vh,54px)] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]"
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" aria-hidden>
        <path d="M14.5 6 8.5 12l6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// --- FormField ---
type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  registration?: UseFormRegisterReturn;
  message?: string;
  messageTone?: "error" | "success";
};

export function FormField({ label, name, type = "text", autoComplete, required = false, registration, message, messageTone }: FormFieldProps) {
  const messageId = message ? `${name}-message` : undefined;
  const hasError = messageTone === "error";
  const inputStateClass = hasError
    ? "border-[#c0392b] focus:border-[#c0392b] focus:ring-[#c0392b]/20"
    : "border-[#8d8d8d] focus:border-[#108bad] focus:ring-[#108bad]/20";
  const messageColorClass = messageTone === "success" ? "text-[#0f7f4f]" : "text-[#c0392b]";

  return (
    <label className="block">
      <span className="mb-[0.75vh] block text-[clamp(9px,1.65vh,15px)] font-black leading-none text-black">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        {...registration}
        aria-invalid={hasError || undefined}
        aria-describedby={messageId}
        className={`block min-h-[40px] w-full rounded-full border bg-transparent px-[14px] text-[clamp(13px,1.85vh,17px)] font-semibold text-black outline-none transition focus:ring-2 md:min-h-[clamp(20px,3.6vh,35px)] ${inputStateClass}`}
      />
      {message && (
        <p id={messageId} className={`mt-1 text-[clamp(10px,1.25vh,12px)] font-bold leading-snug ${messageColorClass}`}>
          {message}
        </p>
      )}
    </label>
  );
}

// --- GenderSelector ---
const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export function GenderSelector({ registration, error }: { registration?: UseFormRegisterReturn; error?: string }) {
  const messageId = error ? "gender-message" : undefined;

  return (
    <fieldset className="mt-[2.4vh]">
      <legend className="mb-[1.1vh] text-[clamp(9px,1.65vh,15px)] font-black leading-none text-black">Gender</legend>
      <div className="grid grid-cols-2 max-md:gap-[4vw]">
        {genderOptions.map((option) => (
          <label key={option.value} className="flex min-h-[40px] items-center gap-2 text-[clamp(12px,1.65vh,15px)] font-black text-black md:min-h-0">
            <input
              type="radio"
              value={option.value}
              {...registration}
              aria-describedby={messageId}
              className="h-[clamp(18px,2.9vh,25px)] w-[clamp(18px,2.9vh,25px)] appearance-none rounded-full border border-[#8d8d8d] bg-transparent checked:border-[5px] checked:border-[#108bad] focus:outline-none focus:ring-2 focus:ring-[#108bad]/20"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={messageId} className="mt-1 text-[clamp(10px,1.25vh,12px)] font-bold leading-snug text-[#c0392b]">{error}</p>
      )}
    </fieldset>
  );
}

// --- ScreenShell ---
export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffef8]">
      <section className="relative min-h-screen w-full overflow-hidden bg-[#fffef8]">
        {children}
      </section>
    </main>
  );
}

// --- SignupSubmitButton ---
export function SignupSubmitButton({ label = "continue" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="mx-auto mt-[8.7vh] block min-h-[44px] w-[clamp(170px,25.4vw,270px)] rounded-full bg-[#108bad] text-[clamp(12px,1.75vh,16px)] font-black lowercase text-white shadow-[0_9px_18px_-15px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a] max-md:mt-[5vh]"
    >
      {label}
    </button>
  );
}

// --- Icons ---
export function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.8 6.1A11.6 11.6 0 0 1 12 6c6.5 0 10 6 10 6a18.3 18.3 0 0 1-4.4 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.4 8.7A18.6 18.6 0 0 0 2 12s3.5 6 10 6c1.4 0 2.8-.3 4-.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3c-1.64 4.66-6.08 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66A19.88 19.88 0 0 0 24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92Z" />
      <path fill="#FF3D00" d="M6.31 14.69 12.9 19.5A12 12 0 0 1 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66A19.88 19.88 0 0 0 24 4 19.94 19.94 0 0 0 6.31 14.69Z" />
      <path fill="#4CAF50" d="M24 44c5.17 0 9.85-1.98 13.38-5.2l-6.18-5.23A11.91 11.91 0 0 1 24 36a12 12 0 0 1-11.28-7.87l-6.54 5.04A20 20 0 0 0 24 44Z" />
      <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3a12.1 12.1 0 0 1-4.1 5.57l.01-.01 6.18 5.23C36.95 39.18 44 34 44 24c0-1.34-.14-2.65-.39-3.92Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#1877F2" />
      <path fill="#fff" d="M27.16 39V25.31h4.6l.69-5.35h-5.29v-3.42c0-1.55.43-2.6 2.66-2.6h2.84V9.15A37.9 37.9 0 0 0 28.52 9c-4.09 0-6.9 2.49-6.9 7.07v3.89h-4.64v5.35h4.64V39h5.54Z" />
    </svg>
  );
}