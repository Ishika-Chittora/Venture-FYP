import { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Competitor } from '@/types/evaluation';

interface Props {
  competitors: Competitor[];
}

const threatColors: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive',
  Medium: 'bg-warning/10 text-warning',
  Low: 'bg-primary/10 text-primary',
};

const defaultEdges: Record<string, string> = {
  High: 'Target their high-churn user segments with a superior onboarding experience and pricing transparency.',
  Medium: 'Differentiate with faster feature iteration and stronger customer support to capture their underserved users.',
  Low: 'Monitor their roadmap and focus on building network effects that create switching costs.',
};

export function CompetitorTable({ competitors }: Props) {
  if (!competitors) return null;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Competitor Landscape</h3>
      </div>
      <div className="space-y-3">
        {competitors.map((c, i) => (
          <div key={i}>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition text-left"
            >
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${threatColors[c.threat]}`}>
                    {c.threat}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.description}</p>
              </div>
              {expanded === i ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              )}
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mx-3 mt-1 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2">
                    <Lightbulb className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Competitive Edge</span>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {c.competitiveEdge || defaultEdges[c.threat]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
