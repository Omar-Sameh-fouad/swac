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
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  workingDays: [],
  workingHours: [],
};

const emptySwimmerDraft: SwimmerSignupDraft = {
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
  level: "",
  trainingDays: [],
  trainingHours: [],
};

const initialState: SignupDraftState = {
  role: null,
  coachDraft: emptyCoachDraft,
  swimmerDraft: emptySwimmerDraft,
};

const SignupContext = createContext<SignupContextValue | undefined>(undefined);

function normalizeStoredDraft(value: unknown): SignupDraftState {
  if (!value || typeof value !== "object") {
    return initialState;
  }

  const stored = value as Partial<SignupDraftState>;

  return {
    role:
      stored.role === "coach" ||
      stored.role === "swimmer" ||
      stored.role === "manager"
        ? stored.role
        : null,
    coachDraft: {
      ...emptyCoachDraft,
      ...(stored.coachDraft ?? {}),
    },
    swimmerDraft: {
      ...emptySwimmerDraft,
      ...(stored.swimmerDraft ?? {}),
    },
  };
}

export function SignupProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraftState>(initialState);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedDraft = window.sessionStorage.getItem(storageKey);

      if (storedDraft) {
        setDraft(normalizeStoredDraft(JSON.parse(storedDraft)));
      }
    } catch {
      setDraft(initialState);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.sessionStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, hasHydrated]);

  const setRole = useCallback((role: SignupRole | null) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      role,
    }));
  }, []);

  const updateCoachDraft = useCallback(
    (partialData: Partial<CoachSignupDraft>) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        coachDraft: {
          ...currentDraft.coachDraft,
          ...partialData,
        },
      }));
    },
    [],
  );

  const updateSwimmerDraft = useCallback(
    (partialData: Partial<SwimmerSignupDraft>) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        swimmerDraft: {
          ...currentDraft.swimmerDraft,
          ...partialData,
        },
      }));
    },
    [],
  );

  const resetSignupDraft = useCallback(() => {
    window.sessionStorage.removeItem(storageKey);
    setDraft(initialState);
  }, []);

  const value = useMemo<SignupContextValue>(
    () => ({
      ...draft,
      setRole,
      updateCoachDraft,
      updateSwimmerDraft,
      resetSignupDraft,
    }),
    [draft, resetSignupDraft, setRole, updateCoachDraft, updateSwimmerDraft],
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}

export function useSignupDraft() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("useSignupDraft must be used within SignupProvider");
  }

  return context;
}