import { Check, Loader2, Circle } from 'lucide-react';
import { STEP_ORDER, STEP_LABELS, type EvaluationStep } from '@/types/evaluation';

interface Props {
  currentStep: EvaluationStep;
}

export function StepProgress({ currentStep }: Props) {
  if (currentStep === 'idle') return null;

  const currentIdx = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Pipeline Status
      </h3>
      <div className="space-y-2">
        {STEP_ORDER.map((step, idx) => {
          const isDone = currentStep === 'complete' || idx < currentIdx;
          const isActive = idx === currentIdx && currentStep !== 'complete';
          const isPending = idx > currentIdx;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-primary/20 text-primary'
                    : isActive
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted text-muted-foreground/30'
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : isActive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <span
                className={`text-sm transition-colors ${
                  isDone
                    ? 'text-primary font-medium'
                    : isActive
                    ? 'text-accent font-medium'
                    : 'text-muted-foreground/40'
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
