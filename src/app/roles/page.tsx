"use client";

import { useRouter } from "next/navigation";
import { RoleSelectionScreen } from "@/components/AuthScreens";
import { useSignupDraft } from "@/core/SignupContext";

export default function RolesPage() {
  const router = useRouter();
  const { resetSignupDraft, setRole } = useSignupDraft();

  return (
    <RoleSelectionScreen
      onBack={() => router.push("/login")}
      onManager={() => {
        resetSignupDraft();
        setRole("manager");
        router.push("/manager/home");
      }}
      onCoach={() => {
        setRole("coach");
        router.push("/coach");
      }}
      onSwimmer={() => {
        setRole("swimmer");
        router.push("/swimmer");
      }}
    />
  );
}