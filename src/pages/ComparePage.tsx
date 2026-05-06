import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GitCompareArrows, Loader2, Swords, Trophy, Calculator } from 'lucide-react';
import { getEvaluations } from '@/services/evaluationStorage';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { EvaluationResult } from '@/types/evaluation';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function ComparePage() {
  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: getEvaluations,
  });

  const evalA = evaluations?.find((e) => e.id === selectedA);
  const evalB = evaluations?.find((e) => e.id === selectedB);

  const resultA = evalA?.result_json as unknown as EvaluationResult | undefined;
  const resultB = evalB?.result_json as unknown as EvaluationResult | undefined;

  // --- TOPSIS ALGORITHM IMPLEMENTATION ---
  const topsisResult = useMemo(() => {
    if (!resultA || !resultB) return null;

    // Criteria Weights: Market (35%), Financial (25%), Technical (20%), Team (10%), Timing (10%)
    const weights = { market: 0.35, technical: 0.2, financial: 0.25, team: 0.1, timing: 0.1 };
    const criteria = ['market', 'technical', 'financial', 'team', 'timing'] as const;

    const calculateCloseness = (res: EvaluationResult) => {
      let dPlus = 0; // Distance to Ideal (100)
      let dMinus = 0; // Distance to Anti-Ideal (0)

      criteria.forEach((key) => {
        const val = res.feasibility[key] || 0;
        dPlus += Math.pow(weights[key] * (val - 100), 2);
        dMinus += Math.pow(weights[key] * (val - 0), 2);
      });

      const sPlus = Math.sqrt(dPlus);
      const sMinus = Math.sqrt(dMinus);
      return sMinus / (sPlus + sMinus); // Closeness Coefficient
    };

    const cA = calculateCloseness(resultA);
    const cB = calculateCloseness(resultB);

    return {
      scoreA: (cA * 100).toFixed(1),
      scoreB: (cB * 100).toFixed(1),
      winner: cA > cB ? 'A' : 'B',
      diff: Math.abs(cA - cB) * 100
    };
  }, [resultA, resultB]);

  const radarData = resultA?.feasibility && resultB?.feasibility
    ? [
        { axis: 'Market', A: resultA.feasibility.market, B: resultB.feasibility.market },
        { axis: 'Technical', A: resultA.feasibility.technical, B: resultB.feasibility.technical },
        { axis: 'Financial', A: resultA.feasibility.financial, B: resultB.feasibility.financial },
        { axis: 'Team', A: resultA.feasibility.team, B: resultB.feasibility.team },
        { axis: 'Timing', A: resultA.feasibility.timing, B: resultB.feasibility.timing },
      ]
    : null;

  const generateSummary = async () => {
    if (!evalA || !evalB || !resultA || !resultB || !topsisResult) return;
    setLoadingSummary(true);
    try {
      const winnerName = topsisResult.winner === 'A' ? evalA.name : evalB.name;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/evaluate-startup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'x-chat-mode': 'true',
        },
        body: JSON.stringify({
          chatMode: true,
          messages: [
            {
              role: 'system',
              content: `You are VentureIQ. My TOPSIS mathematical algorithm has identified ${winnerName} as the statistically superior investment. Summarize the comparison in 3 sentences.`,
            },
            {
              role: 'user',
              content: `Compare ${evalA.name} and ${evalB.name}. Data: ${JSON.stringify({ resultA, resultB })}`,
            },
          ],
        }),
      });
      const data = await response.json();
      setAiSummary(data.reply || 'Unable to generate summary.');
    } catch {
      setAiSummary('Failed to generate comparison.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const MetricCard = ({ label, valueA, valueB }: { label: string; valueA: string; valueB: string }) => (
    <div className="glass rounded-xl p-3">
      <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[hsl(var(--primary))] font-mono">{valueA}</span>
        <span className="text-[10px] text-muted-foreground">vs</span>
        <span className="text-sm font-bold text-accent font-mono">{valueB}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <GitCompareArrows className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Battle Mode</h2>
          <p className="text-xs text-muted-foreground">TOPSIS Mathematical Ranking Engine</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading evaluations...</p>
      ) : !evaluations?.length ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Swords className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Run at least two evaluations to compare.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Startup A</label>
              <select
                value={selectedA}
                onChange={(e) => setSelectedA(e.target.value)}
                className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="">Select a startup...</option>
                {evaluations.filter((e) => e.id !== selectedB).map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.overall_score}/100)</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Startup B</label>
              <select
                value={selectedB}
                onChange={(e) => setSelectedB(e.target.value)}
                className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="">Select a startup...</option>
                {evaluations.filter((e) => e.id !== selectedA).map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.overall_score}/100)</option>
                ))}
              </select>
            </div>
          </div>

          {radarData && resultA && resultB && evalA && evalB && topsisResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* ALGORITHM WINNER BANNER */}
              <div className="relative overflow-hidden glass rounded-2xl p-6 border-l-4 border-primary bg-primary/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Calculator className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Mathematical Winner</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {topsisResult.winner === 'A' ? evalA.name : evalB.name} Dominates
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Efficiency Score</p>
                      <p className="text-xl font-mono font-bold text-primary">
                        {topsisResult.winner === 'A' ? topsisResult.scoreA : topsisResult.scoreB}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Double Radar */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Feasibility Profile Comparison</h3>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {evalA.name}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 rounded-full bg-accent" /> {evalB.name}
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(217 33% 18%)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={evalA.name} dataKey="A" stroke="hsl(152 76% 36%)" fill="hsl(152 76% 36%)" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name={evalB.name} dataKey="B" stroke="hsl(187 92% 45%)" fill="hsl(187 92% 45%)" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Metric comparison */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Global Score" valueA={`${resultA.overallScore}`} valueB={`${resultB.overallScore}`} />
                <MetricCard label="TOPSIS Rank" valueA={`${topsisResult.scoreA}%`} valueB={`${topsisResult.scoreB}%`} />
                <MetricCard label="Burn Rate" valueA={`$${((resultA.burnRate ?? 0)/1000).toFixed(0)}K`} valueB={`$${((resultB.burnRate ?? 0)/1000).toFixed(0)}K`} />
                <MetricCard label="CAC/LTV" valueA={`${(resultA.cacLtvRatio ?? 0).toFixed(1)}x`} valueB={`${(resultB.cacLtvRatio ?? 0).toFixed(1)}x`} />
              </div>

              {/* AI Summary */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">AI Strategic Synthesis</h3>
                  <button
                    onClick={generateSummary}
                    disabled={loadingSummary}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loadingSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Swords className="h-3.5 w-3.5" />}
                    {loadingSummary ? 'Analyzing Math...' : 'Generate Expert Summary'}
                  </button>
                </div>
                {aiSummary ? (
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">"{aiSummary}"</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Grounding the AI analysis in the mathematical TOPSIS result...</p>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}