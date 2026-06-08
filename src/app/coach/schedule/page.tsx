"use client";
import { useRouter } from "next/navigation";
import { CoachScheduleScreen } from "@/components/CoachScreens";

export default function CoachSchedulePage() {
  const router = useRouter();
  return <CoachScheduleScreen onBack={() => router.push("/coach")} onDone={() => router.push("/coach/hours")} />;
}