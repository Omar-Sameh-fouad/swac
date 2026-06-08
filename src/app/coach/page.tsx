"use client";
import { useRouter } from "next/navigation";
import { CoachSignupScreen } from "@/components/CoachScreens";

export default function CoachPage() {
  const router = useRouter();
  return <CoachSignupScreen onBack={() => router.push("/roles")} onComplete={() => router.push("/coach/schedule")} />;
}