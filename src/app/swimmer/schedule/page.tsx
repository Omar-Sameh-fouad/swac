"use client";
import { useRouter } from "next/navigation";
import { SwimmerScheduleScreen } from "@/components/SwimmerScreens";

export default function SwimmerSchedulePage() {
  const router = useRouter();
  return <SwimmerScheduleScreen onBack={() => router.push("/swimmer")} onNext={() => router.push("/swimmer/hours")} />;
}