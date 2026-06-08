"use client";

import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/AuthScreens";

export default function LoginPage() {
  const router = useRouter();

  // نستقبل نوع الحساب اللي طالع من الـ API بعد نجاح اللوجين
  function handleSignIn(userRole: string) {
    if (userRole === "coach") {
      return router.push("/coach/home");
    }
    if (userRole === "swimmer") {
      return router.push("/swimmer/home");
    }
    if (userRole === "manager") {
      return router.push("/manager/home");
    }
    
    // كإجراء احتياطي لو مفيش دور راجع أو حصلت مشكلة
    router.push("/roles");
  }

  return (
    <LoginScreen
      onSignIn={handleSignIn}
      onSignUp={() => router.push("/roles")}
    />
  );
}