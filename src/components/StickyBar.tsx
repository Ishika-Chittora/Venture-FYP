import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Activity } from 'lucide-react';

interface Props {
  name: string;
  score: number;
  riskLevel: string;
  onReset: () => void;
}

const riskColors: Record<string, string> = {
  Low: 'text-primary',
  Medium: 'text-warning',
  High: 'text-destructive',
  Critical: 'text-destructive',
};

export function StickyBar({ name, score, riskLevel, onReset }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-[100] glass border-b border-border/30"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{name}</span>
              <span className="font-mono text-sm font-bold gradient-text">{score}/100</span>
              <span className={`text-xs font-semibold ${riskColors[riskLevel]}`}>
                {riskLevel} Risk
              </span>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Analysis
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
