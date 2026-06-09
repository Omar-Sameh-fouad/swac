// مسار الملف: src/core/SignupContext.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CoachSignupDraft, SignupRole, SwimmerSignupDraft } from "./types";
import { getSessionUser } from "./api";

type SignupDraftState = {
  role: SignupRole | null;
  coachDraft: CoachSignupDraft;
  swimmerDraft: SwimmerSignupDraft;
};

type SignupContextValue = SignupDraftState & {
  setRole: (role: SignupRole | null) => void;
  updateCoachDraft: (partialData: Partial<CoachSignupDraft>) => void;
  updateSwimmerDraft: (partialData: Partial<SwimmerSignupDraft>) => void;
  resetSignupDraft: () => void;
};

const storageKey = "swim-master-signup-draft-v1";

const emptyCoachDraft: CoachSignupDraft = { firstName: "", lastName: "", gender: "", phone: "", email: "", password: "", confirmPassword: "", workingDays: [], workingHours: [] };
const emptySwimmerDraft: SwimmerSignupDraft = { firstName: "", lastName: "", gender: "", phone: "", email: "", password: "", confirmPassword: "", age: "", level: "", trainingDays: [], trainingHours: [] };

const initialState: SignupDraftState = { role: null, coachDraft: emptyCoachDraft, swimmerDraft: emptySwimmerDraft };
const SignupContext = createContext<SignupContextValue | undefined>(undefined);

function normalizeStoredDraft(value: unknown): SignupDraftState {
  if (!value || typeof value !== "object") return initialState;
  const stored = value as Partial<SignupDraftState>;
  return {
    role: stored.role === "coach" || stored.role === "swimmer" || stored.role === "manager" ? stored.role : null,
    coachDraft: { ...emptyCoachDraft, ...(stored.coachDraft ?? {}) },
    swimmerDraft: { ...emptySwimmerDraft, ...(stored.swimmerDraft ?? {}) },
  };
}

export function SignupProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraftState>(initialState);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedDraft = window.sessionStorage.getItem(storageKey);
      const sessionUser = getSessionUser();

      if (storedDraft) {
        const parsedDraft = normalizeStoredDraft(JSON.parse(storedDraft));
        if (sessionUser && !parsedDraft.coachDraft.id && !parsedDraft.swimmerDraft.id) {
          const role = sessionUser.role as SignupRole;
          parsedDraft.role = role;
          if (role === "coach") {
            parsedDraft.coachDraft = { ...parsedDraft.coachDraft, id: sessionUser.id, firstName: sessionUser.first_name || "", lastName: sessionUser.last_name || "", email: sessionUser.email || "", phone: sessionUser.phone || "", gender: sessionUser.gender || "" };
          } else if (role === "swimmer") {
            parsedDraft.swimmerDraft = { ...parsedDraft.swimmerDraft, id: sessionUser.id, firstName: sessionUser.first_name || "", lastName: sessionUser.last_name || "", email: sessionUser.email || "", phone: sessionUser.phone || "", age: sessionUser.age?.toString() || "", level: sessionUser.level || "", gender: sessionUser.gender || "" };
          }
        }
        setDraft(parsedDraft);
      } else if (sessionUser) {
        const role = sessionUser.role as SignupRole;
        setDraft({
          role,
          coachDraft: role === "coach" ? { ...emptyCoachDraft, id: sessionUser.id, firstName: sessionUser.first_name || "", lastName: sessionUser.last_name || "", email: sessionUser.email || "", phone: sessionUser.phone || "", gender: sessionUser.gender || "" } : emptyCoachDraft,
          swimmerDraft: role === "swimmer" ? { ...emptySwimmerDraft, id: sessionUser.id, firstName: sessionUser.first_name || "", lastName: sessionUser.last_name || "", email: sessionUser.email || "", phone: sessionUser.phone || "", age: sessionUser.age?.toString() || "", level: sessionUser.level || "", gender: sessionUser.gender || "" } : emptySwimmerDraft,
        });
      }
    } catch {
      setDraft(initialState);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    window.sessionStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, hasHydrated]);

  const setRole = useCallback((role: SignupRole | null) => setDraft((current) => ({ ...current, role })), []);
  const updateCoachDraft = useCallback((partialData: Partial<CoachSignupDraft>) => setDraft((current) => ({ ...current, coachDraft: { ...current.coachDraft, ...partialData } })), []);
  const updateSwimmerDraft = useCallback((partialData: Partial<SwimmerSignupDraft>) => setDraft((current) => ({ ...current, swimmerDraft: { ...current.swimmerDraft, ...partialData } })), []);
  const resetSignupDraft = useCallback(() => { window.sessionStorage.removeItem(storageKey); setDraft(initialState); }, []);

  const value = useMemo(() => ({ ...draft, setRole, updateCoachDraft, updateSwimmerDraft, resetSignupDraft }), [draft, resetSignupDraft, setRole, updateCoachDraft, updateSwimmerDraft]);

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignupDraft() {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignupDraft must be used within SignupProvider");
  return context;
}