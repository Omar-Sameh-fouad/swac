// مسار الملف: src/core/SignupContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CoachSignupDraft, SignupRole, SwimmerSignupDraft } from "./types";
import { getSessionUser } from "./api"; // استيراد المستخدم المحفوظ

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

const emptyCoachDraft: CoachSignupDraft = {
  firstName: "", lastName: "", gender: "", phone: "", email: "", password: "", confirmPassword: "", workingDays: [], workingHours: [],
};

const emptySwimmerDraft: SwimmerSignupDraft = {
  firstName: "", lastName: "", gender: "", phone: "", email: "", password: "", confirmPassword: "", age: "", level: "", trainingDays: [], trainingHours: [],
};

const initialState: SignupDraftState = {
  role: null,
  coachDraft: emptyCoachDraft,
  swimmerDraft: emptySwimmerDraft,
};

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
      const sessionUser = getSessionUser(); // قراءة اليوزر من اللوكال ستوريدج مباشرة

      let newDraft = initialState;

      if (storedDraft) {
        newDraft = normalizeStoredDraft(JSON.parse(storedDraft));
      }

      // الدمج الآمن: إذا كان هناك يوزر مسجل دخول، نقوم بتحديث الداتا الخاصة به في الـ Context
      if (sessionUser) {
        const role = sessionUser.role as SignupRole;
        newDraft.role = role;
        if (role === "coach") {
          newDraft.coachDraft = {
            ...newDraft.coachDraft,
            id: sessionUser.id,
            firstName: sessionUser.first_name || newDraft.coachDraft.firstName,
            lastName: sessionUser.last_name || newDraft.coachDraft.lastName,
            email: sessionUser.email || newDraft.coachDraft.email,
            phone: sessionUser.phone || newDraft.coachDraft.phone,
            gender: sessionUser.gender || newDraft.coachDraft.gender,
          };
        } else if (role === "swimmer") {
          newDraft.swimmerDraft = {
            ...newDraft.swimmerDraft,
            id: sessionUser.id,
            firstName: sessionUser.first_name || newDraft.swimmerDraft.firstName,
            lastName: sessionUser.last_name || newDraft.swimmerDraft.lastName,
            email: sessionUser.email || newDraft.swimmerDraft.email,
            phone: sessionUser.phone || newDraft.swimmerDraft.phone,
            age: sessionUser.age?.toString() || newDraft.swimmerDraft.age,
            level: sessionUser.level || newDraft.swimmerDraft.level,
            gender: sessionUser.gender || newDraft.swimmerDraft.gender,
          };
        }
      }

      setDraft(newDraft);
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

  const value = useMemo(() => ({
      ...draft, setRole, updateCoachDraft, updateSwimmerDraft, resetSignupDraft,
    }), [draft, resetSignupDraft, setRole, updateCoachDraft, updateSwimmerDraft]);

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignupDraft() {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignupDraft must be used within SignupProvider");
  return context;
}