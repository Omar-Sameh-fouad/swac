"use client";
import { useRouter } from "next/navigation";
import { TeamsTableScreen } from "@/components/ManagerScreens";

export default function ManagerTablesPage() {
  const router = useRouter();
  return <TeamsTableScreen onBack={() => router.push("/manager/home")} onDone={() => router.push("/manager/home")} />;
}