"use client";
import { useRouter } from "next/navigation";
import { SwimmerHoursScreen } from "@/components/SwimmerScreens";

export default function SwimmerHoursPage() {
  const router = useRouter();
  return <SwimmerHoursScreen onBack={() => router.push("/swimmer/schedule")} onDone={() => router.push("/swimmer/home")} />;
}