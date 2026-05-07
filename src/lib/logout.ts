import { supabase } from '@/integrations/supabase/client';
import { useEvaluationStore } from '@/store/evaluationStore';

const ONBOARDING_SESSION_KEY = 'ventureiq-onboarding-session-id';
const ONBOARDING_SEEN_KEY = 'ventureiq-onboarding-session-seen';
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';
const EVALUATION_PERSIST_KEY = 'ventureiq-evaluation';
const CELEBRATION_SHOWN_KEY = 'ventureiq-celebration-shown';
const ONBOARDING_USER_PREFIX = 'ventureiq-onboarding-user-';
const AUTH_TOKEN_KEYS = ['auth_token', 'authToken'];
const SUPABASE_KEYS = ['sb-access-token', 'sb-refresh-token'];

function clearOnboardingStorage() {
  if (typeof window === 'undefined') return;
  const keys = Object.keys(window.localStorage);
  for (const key of keys) {
    if (
      key === ONBOARDING_SESSION_KEY ||
      key === ONBOARDING_SEEN_KEY ||
      key === ONBOARDING_COMPLETE_KEY ||
      key === EVALUATION_PERSIST_KEY ||
      key === CELEBRATION_SHOWN_KEY ||
      key.startsWith(ONBOARDING_USER_PREFIX) ||
      AUTH_TOKEN_KEYS.includes(key) ||
      SUPABASE_KEYS.includes(key) ||
      key.includes('supabase') ||
      key.includes('onboarding')
    ) {
      window.localStorage.removeItem(key);
    }
  }
  // Also clear session storage for a complete "Cold Start"
  window.sessionStorage.clear();
}

export async function handleLogout() {
  if (typeof window === 'undefined') return;

  // 1. Wipe all persisted flags to reset the Guided Path & Tour
  clearOnboardingStorage();

  // 2. Reset the Zustand global store (Evaluation data)
  useEvaluationStore.getState().reset();

  try {
    // 3. Optional: Sign out from Supabase 
    // If you want to keep the user logged in but just reset the tour, 
    // you can comment the next line out.
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('Logout error:', error);
  }

  // 4. CRITICAL: Redirect to Home Page instead of Auth
  // This triggers a fresh lifecycle where the app sees "onboarding_complete" is missing
  window.location.href = '/'; 
}