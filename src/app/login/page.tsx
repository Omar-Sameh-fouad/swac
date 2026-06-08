"use client";

import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/AuthScreens";
import { useSignupDraft } from "@/core/SignupContext";

export default function LoginPage() {
  const router = useRouter();
  const { role } = useSignupDraft();

  function handleSignIn() {
    if (role === "coach") return router.push("/coach/home");
    if (role === "swimmer") return router.push("/swimmer/home");
    if (role === "manager") return router.push("/manager/home");
    router.push("/roles");
  }

  return (
    <LoginScreen
      onSignIn={handleSignIn}
      onSignUp={() => router.push("/roles")}
    />
  );
}