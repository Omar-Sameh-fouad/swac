"use client";
import { useRouter } from "next/navigation";
import { SwimmerSignupScreen } from "@/components/SwimmerScreens";

export default function SwimmerPage() {
  const router = useRouter();
  return <SwimmerSignupScreen onBack={() => router.push("/roles")} onComplete={() => router.push("/swimmer/schedule")} />;
}