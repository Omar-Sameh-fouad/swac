"use client";
import { useRouter } from "next/navigation";
import { CoachScheduleScreen } from "@/components/CoachScreens";

export default function CoachSchedulePage() {
  const router = useRouter();
  return <CoachScheduleScreen onBack={() => router.push("/coach")} onNext={() => router.push("/coach/hours")} />;
}