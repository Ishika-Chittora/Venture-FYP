import { Shield, AlertTriangle, Lightbulb, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SwotAnalysis, SwotItem } from '@/types/evaluation';

interface Props {
  swot: SwotAnalysis;
}

const impactBadge: Record<string, { base: string; glow: string }> = {
  High: { base: 'bg-destructive/10 text-destructive border-destructive/20', glow: 'group-hover:glow-rose' },
  Medium: { base: 'bg-warning/10 text-warning border-warning/20', glow: 'group-hover:glow-amber' },
  Low: { base: 'bg-primary/10 text-primary border-primary/20', glow: 'group-hover:glow-emerald' },
};

const sections = [
  { key: 'strengths' as const, label: 'Strengths', icon: Shield, color: 'text-primary' },
  { key: 'weaknesses' as const, label: 'Weaknesses', icon: AlertTriangle, color: 'text-destructive' },
  { key: 'opportunities' as const, label: 'Opportunities', icon: Lightbulb, color: 'text-accent' },
  { key: 'threats' as const, label: 'Threats', icon: Crosshair, color: 'text-warning' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

// ...existing code...
function SwotCard({ items, label, icon: Icon, color }: {
  items: SwotItem[];
  label: string;
  icon: typeof Shield;
  color: string;
}) {
  return (
    <motion.div variants={card} className="glass glass-hover rounded-xl p-4 group">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${color}`} />
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
      </div>
      <div className="space-y-2">
        {items?.map((item, i) => (
          item ? (
            <div key={i} className="flex items-start gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border flex-shrink-0 mt-0.5 transition-shadow duration-300 ${
                impactBadge[item.impact]?.base || 'bg-muted/10 text-muted-foreground border-muted/20'
              } ${
                impactBadge[item.impact]?.glow || ''
              }`}>
                {item.impact || 'Unknown'}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ) : null
        ))}
      </div>
    </motion.div>
  );
}
// ...existing code...
export function SwotGrid({ swot }: Props) {
  if (!swot) return null;  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">SWOT Analysis</h3>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((s) => (
          <SwotCard key={s.key} items={swot[s.key]} label={s.label} icon={s.icon} color={s.color} />
        ))}
      </motion.div>
    </div>
  );
}
