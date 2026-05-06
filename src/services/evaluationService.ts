import type { IdeaInput, EvaluationResult, EvaluationStep } from '@/types/evaluation';
import { STEP_ORDER } from '@/types/evaluation';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function runEvaluation(
  input: IdeaInput,
  onStep: (step: EvaluationStep) => void
): Promise<EvaluationResult> {
  // Simulate step progression while waiting for AI
  const stepPromise = simulateSteps(onStep);

  const response = await fetch(`${SUPABASE_URL}/functions/v1/evaluate-startup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(input),
  });

  
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Evaluation failed (${response.status})`);
  }

  const result = await response.json();
  await stepPromise;
  onStep('complete');
  return result as EvaluationResult;
}

async function simulateSteps(onStep: (step: EvaluationStep) => void) {
  for (const step of STEP_ORDER.slice(0, -1)) {
    onStep(step);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
  }
}
