import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

interface OnboardingContextValue {
  active: boolean;
  currentStepIndex: number;
  steps: OnboardingStep[];
  isNewUser: boolean;
  sessionId: string | null;
  advanceStep: () => void;
  goToStep: (index: number) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  active: false,
  currentStepIndex: 0,
  steps: [],
  isNewUser: false,
  sessionId: null,
  advanceStep: () => {},
  goToStep: () => {},
  completeOnboarding: () => {},
  skipOnboarding: () => {},
});

const SESSION_STORAGE_KEY = 'ventureiq-onboarding-session-id';
const SESSION_SEEN_KEY = 'ventureiq-onboarding-session-seen';
const USER_ONBOARDING_PREFIX = 'ventureiq-onboarding-user-';

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;
  let sessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `session-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

function getUserOnboardingKey(userId: string) {
  return `${USER_ONBOARDING_PREFIX}${userId}`;
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const steps: OnboardingStep[] = useMemo(
    () => [
      {
        id: 'welcome',
        title: 'Welcome to VentureIQ',
        description: 'Tap through a quick guided path to set up your first startup evaluation.',
      },
      {
        id: 'profile',
        title: 'Complete Your Profile',
        description: 'Add your startup details so the AI evaluation matches your business model.',
      },
      {
        id: 'run-evaluation',
        title: 'Run Your First Evaluation',
        description: 'Submit your idea inputs and watch the risk engine generate projections and guidance.',
      },
      {
        id: 'review-results',
        title: 'Review Key Insights',
        description: 'Explore break-even, CAC/LTV, and Monte Carlo risk analysis tailored to your startup.',
      },
    ],
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sessionId = getOrCreateSessionId();
    setSessionId(sessionId);

    const sessionSeen = window.localStorage.getItem(SESSION_SEEN_KEY) === 'true';
    const userKey = user ? getUserOnboardingKey(user.id) : null;
    const userCompleted = userKey ? window.localStorage.getItem(userKey) === 'completed' : false;
    const shouldStart = Boolean(user && (!userCompleted || !sessionSeen));

    setIsNewUser(Boolean(user && !userCompleted));
    setActive(shouldStart);

    if (!sessionSeen) {
      window.localStorage.setItem(SESSION_SEEN_KEY, 'true');
    }
  }, [user, loading]);

  const completeOnboarding = () => {
    if (typeof window === 'undefined' || !user) return;
    const userKey = getUserOnboardingKey(user.id);
    window.localStorage.setItem(userKey, 'completed');
    window.localStorage.setItem(SESSION_SEEN_KEY, 'true');
    setActive(false);
    setCurrentStepIndex(steps.length - 1);
  };

  const skipOnboarding = () => {
    if (typeof window === 'undefined' || !user) return;
    const userKey = getUserOnboardingKey(user.id);
    window.localStorage.setItem(userKey, 'completed');
    window.localStorage.setItem(SESSION_SEEN_KEY, 'true');
    setActive(false);
  };

  const advanceStep = () => {
    setCurrentStepIndex((current) => {
      const next = current + 1;
      if (next >= steps.length) {
        completeOnboarding();
        return steps.length - 1;
      }
      return next;
    });
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  };

  return (
    <OnboardingContext.Provider
      value={{
        active,
        currentStepIndex,
        steps,
        isNewUser,
        sessionId,
        advanceStep,
        goToStep,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
