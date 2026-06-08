"use client";

import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/AuthScreens";

export default function LoginPage() {
  const router = useRouter();

  function handleSignIn(userRole: string) {
    if (userRole === "coach") {
      return router.push("/coach/home");
    }
    if (userRole === "manager") {
      return router.push("/manager/home");
    }
      return router.push("/swimmer/home");
  }

  return (
    <LoginScreen
      onSignIn={handleSignIn}
      // الزرار ده هو اللي هيدخله يختار الرول لو لسه معندوش أكونت
      onSignUp={() => router.push("/roles")} 
    />
  );
}