import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
}

export function ConfidenceMeter({ score }: Props) {
  const color =
    score >= 70 ? 'text-primary bg-primary/10' :
    score >= 40 ? 'text-warning bg-warning/10' :
    'text-destructive bg-destructive/10';

  const label =
    score >= 70 ? 'High Confidence' :
    score >= 40 ? 'Moderate Confidence' :
    'Low Confidence — results may be speculative';

  const Icon = score >= 50 ? ShieldCheck : ShieldAlert;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${color}`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{score}% Data Reliability</span>
        </div>
        <p className="text-xs opacity-80">{label}</p>
      </div>
      <div className="w-16 h-1.5 rounded-full bg-current/20 overflow-hidden flex-shrink-0">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full rounded-full bg-current"
        />
      </div>
    </motion.div>
  );
}
