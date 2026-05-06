import { AnimatePresence, motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function OnboardingGuide() {
  const {
    active,
    currentStepIndex,
    steps,
    isNewUser,
    advanceStep,
    skipOnboarding,
    completeOnboarding,
  } = useOnboarding();

  if (!active) return null;

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="fixed bottom-6 right-6 z-50 w-[clamp(320px,30vw,420px)] rounded-3xl border border-white/10 bg-background/95 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Onboarding guide</p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">{currentStep.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{currentStep.description}</p>
          </div>
          <button
            onClick={skipOnboarding}
            className="text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => index <= currentStepIndex && advanceStep()}
              className={`h-2 rounded-full transition ${index <= currentStepIndex ? 'bg-primary' : 'bg-muted/30'}`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {isNewUser ? 'New user path' : 'Session recap'} • step {currentStepIndex + 1} of {steps.length}
          </span>
          <button
            onClick={isLastStep ? completeOnboarding : advanceStep}
            className="rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-95 transition"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
