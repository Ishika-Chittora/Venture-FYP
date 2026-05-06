import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import type { EvaluationResult, IdeaInput } from '@/types/evaluation';

interface Props {
  result: EvaluationResult;
  latency: number | null;
  input?: IdeaInput;
}

const riskColors: Record<string, string> = {
  Low: 'text-primary bg-primary/10',
  Medium: 'text-warning bg-warning/10',
  High: 'text-destructive bg-destructive/10',
  Critical: 'text-destructive bg-destructive/20',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ScoreOverview({ result, latency, input }: Props) {
  const animatedScore = useCountUp(result?.overallScore ?? 0);
  const animatedBreakEven = useCountUp(result?.breakEvenMonth ?? 0, 800);

  if (!result) return null;

  const breakEvenExplanation = input ? (
    <div className="mt-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1 mb-1">
        <Info className="h-3 w-3" />
        <span className="font-medium">Break-even Formula:</span>
      </div>
      <p className="font-mono text-xs">
        Revenue = ${input.pricePerUser} × Users<br/>
        Users = {input.teamSize} × (1 + growth)^{'{month}'}<br/>
        Break-even when cumulative revenue ≥ cumulative burn
      </p>
    </div>
  ) : null;

  const metrics = [
    {
      label: 'Overall Score',
      value: `${animatedScore}/100`,
      icon: Activity,
      highlight: true,
    },
    {
      label: 'Burn Rate',
      value: `$${(result.burnRate / 1000).toFixed(0)}K/mo`,
      icon: DollarSign,
    },
    {
      label: 'CAC/LTV Ratio',
      value: `${(result.cacLtvRatio ?? 0).toFixed(2)}x`,
      icon: result.cacLtvRatio < 3 ? TrendingUp : TrendingDown,
    },
    {
      label: 'Break-even',
      value: `Month ${animatedBreakEven}`,
      icon: Clock,
    },
    {
      label: 'Sentiment',
      value: `${((result.marketSentiment ?? 0) * 100).toFixed(0)}%`,
      icon: Users,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">Risk Summary</h3>
        <div className="flex items-center gap-3">
          {latency && (
            <span className="text-xs text-muted-foreground font-mono">
              {(latency / 1000).toFixed(1)}s
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskColors[result.riskLevel]}`}>
            {result.riskLevel} Risk
          </span>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            variants={item}
            className={`rounded-xl p-3 ${
              m.highlight ? 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20' : 'bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <p className={`text-lg font-bold font-mono ${m.highlight ? 'gradient-text' : 'text-foreground'}`}>
              {m.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
    </motion.div>
  );
}
