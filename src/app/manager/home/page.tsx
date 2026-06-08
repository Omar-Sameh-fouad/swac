"use client";
import { useRouter } from "next/navigation";
import { ManagerHomeScreen } from "@/components/ManagerScreens";

export default function ManagerHomePage() {
  const router = useRouter();
  return <ManagerHomeScreen onBack={() => router.push("/roles")} onEditTables={() => router.push("/manager/tables")} onProfile={() => router.push("/profile")} />;
}