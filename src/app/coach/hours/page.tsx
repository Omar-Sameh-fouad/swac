"use client";
import { useRouter } from "next/navigation";
import { CoachHoursScreen } from "@/components/CoachScreens";

export default function CoachHoursPage() {
  const router = useRouter();
  return <CoachHoursScreen onBack={() => router.push("/coach/schedule")} onDone={() => router.push("/coach/home")} />;
}