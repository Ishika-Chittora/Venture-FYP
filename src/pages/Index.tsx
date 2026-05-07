import { useCallback, useEffect, useState } from 'react';
import { RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvaluationStore } from '@/store/evaluationStore';
import { runEvaluation } from '@/services/evaluationService';
import { EvaluationForm } from '@/components/EvaluationForm';
import { StepProgress } from '@/components/StepProgress';
import { ScoreOverview } from '@/components/ScoreOverview';
import { FeasibilityRadar } from '@/components/FeasibilityRadar';
import { ProjectionChart } from '@/components/ProjectionChart';
import { SwotGrid } from '@/components/SwotGrid';
import { CompetitorTable } from '@/components/CompetitorTable';
import { Recommendations } from '@/components/Recommendations';
import { SensitivityAnalysis } from '@/components/SensitivityAnalysis';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { ExportButton } from '@/components/ExportButton';
import { AIChatDrawer } from '@/components/AIChatDrawer';
import SkeletonDashboard from '@/components/SkeletonDashboard';
import { KanbanActionPlan } from '@/components/KanbanActionPlan';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ExplainableAI } from '@/components/Explainableai';
import { MoneyRain } from '@/components/MoneyRain';
import { DashboardAnalyticsPanel } from '@/components/DashboardAnalyticsPanel';
import { buildFallbackResult } from '@/utils/resultNormalizer';
import type { IdeaInput } from '@/types/evaluation';
// Add this to your imports at the top
import { saveEvaluation } from '@/services/evaluationStorage';
import { toast } from 'sonner';

const Index = () => {
  const {
    step, input, result, error, latency,
    setStep, setResult, setError, startEvaluation, reset,
  } = useEvaluationStore();

  const isLoading = step !== 'idle' && step !== 'complete' && step !== 'error';
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shown = window.localStorage.getItem('ventureiq-celebration-shown') === 'true';
    setCelebrationShown(shown);
  }, []);

  useEffect(() => {
    if (step === 'complete' && !celebrationShown && result) {
      setCelebrationVisible(true);
      setCelebrationShown(true);
      window.localStorage.setItem('ventureiq-celebration-shown', 'true');
    }
  }, [step, celebrationShown, result]);

  const normalized = result
    ? (() => {
        try {
          return buildFallbackResult(result, input)
        } catch (e) {
          console.error('Result normalization failed:', e)
          return null
        }
      })()
    : null

  const handleSubmit = useCallback(
  async (formInput: IdeaInput) => {
    startEvaluation(formInput);
    try {
      const rawData = await runEvaluation(formInput, setStep);
      
      // 1. Set the local result first for UI responsiveness
      setResult(rawData);
      setStep('complete');

      // 2. TRIGGER THE CLOUD SAVE
      try {
        await saveEvaluation(formInput, rawData);
        toast.success("Analysis persisted to cloud history");
      } catch (saveErr) {
        console.error("Cloud Save Failed:", saveErr);
        toast.error("Results shown but not saved to history. Check console.");
      }

    } catch (err: any) {
      console.error("Evaluation Error:", err);
      const fallback = buildFallbackResult({
        overallScore: 40,
        burnRate: 25000,
      }, formInput);
      setResult(fallback);
      setStep('complete');
      
      // Optional: Save the fallback result as well
      await saveEvaluation(formInput, fallback);
    }
  },
  [startEvaluation, setStep, setResult]
);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Input Phase */}
      {(step === 'idle' || isLoading) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EvaluationForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <div>
            <StepProgress currentStep={step} />
          </div>
        </div>
      )}

      {/* Skeleton while loading */}
      {isLoading && (
        <div className="mt-6">
          <SkeletonDashboard />
        </div>
      )}

      {/* Error */}
      {step === 'error' && error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6 border-destructive/30"
        >
          <p className="text-destructive font-medium">Error: {error}</p>
          <button onClick={reset} className="mt-3 px-4 py-2 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition">
            Try Again
          </button>
        </motion.div>
      )}

      {/* Results Section */}
      {step === 'complete' && normalized && (
        <div className="space-y-6 relative overflow-hidden">
          <MoneyRain show={celebrationVisible} onComplete={() => setCelebrationVisible(false)} />

          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">{input?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {input?.industry} · {input?.fundingStage}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {input && <ExportButton result={normalized} input={input} />}
              <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 transition">
                <RotateCcw className="h-3.5 w-3.5" />
                New Analysis
              </button>
            </div>
          </div>

          {/* ── THE WHY FACTOR: LOGIC AUDIT ── */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2rem] p-8 border border-white/10 bg-slate-900/40 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                  <ShieldCheck className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">System Transparency Audit</h3>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-green-400">
                   The Why Factor
                  </h2>
                </div>
              </div>

              <div className="flex-1 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {normalized.reliabilityReasons?.map((reason: string, i: number) => {
                  // Splitting the technical string to add a meaningful bold prefix
                  const [title, description] = reason.includes(':') ? reason.split(':') : ["Audit Note", reason];
                  
                  return (
                    <div key={i} className="flex flex-col gap-1 p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-black uppercase text-amber-500 tracking-widest">{title}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200 leading-snug mt-1">{description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
          {/* ── ADDED FEATURE 2: EXPLAINABLE AI BREAKDOWN ──[cite: 1] */}
          <ErrorBoundary>
            <ExplainableAI result={normalized} />
          </ErrorBoundary>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ConfidenceMeter score={normalized.confidenceScore} />
              </motion.div>

              <ScoreOverview result={normalized} latency={latency} />
            </div>
            <DashboardAnalyticsPanel />
          </div>

          {/* Original Radar + Projection charts */}
          <ErrorBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeasibilityRadar scores={normalized.feasibility} />
              <ProjectionChart
                projections={normalized.projections}
                breakEvenMonth={normalized.breakEvenMonth}
              />
            </div>
          </ErrorBoundary>

          {/* Original Sensitivity analysis */}
          <SensitivityAnalysis
            baseProjections={normalized.projections}
            baseBurn={normalized.burnRate}
            baseBreakEven={normalized.breakEvenMonth}
          />

          {/* Original SWOT */}
          <ErrorBoundary>
            <SwotGrid swot={normalized.swot} />
          </ErrorBoundary>

          {/* Original Action plan kanban */}
          {/* ── ACTION PLAN ROADMAP ── */}
          {normalized.actionPlan && (
            <ErrorBoundary>
              <KanbanActionPlan actionPlan={normalized.actionPlan} />
            </ErrorBoundary>
          )}

          {/* Original Competitors + Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompetitorTable competitors={normalized.competitors} />
            <Recommendations recommendations={normalized.recommendations} />
          </div>

        </div>
      )}

      {/* AI Chat Drawer */}
      {step === 'complete' && normalized && input && (
        <AIChatDrawer result={normalized._raw} input={input} />
      )}

    </div>
  )
}

export default Index