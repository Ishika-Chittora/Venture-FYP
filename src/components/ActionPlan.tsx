import { motion } from 'framer-motion';
import { Calendar, Rocket, Megaphone, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ActionPlanProps {
  actionPlan: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
}

const weeks = [
  { key: 'week1' as const, title: 'Week 1: Foundation', icon: Calendar, color: 'text-blue-400', glow: 'bg-blue-500/10' },
  { key: 'week2' as const, title: 'Week 2: MVP & Validation', icon: Rocket, color: 'text-primary', glow: 'bg-primary/10' },
  { key: 'week3' as const, title: 'Week 3: Marketing', icon: Megaphone, color: 'text-amber-400', glow: 'bg-amber-500/10' },
  { key: 'week4' as const, title: 'Week 4: Growth', icon: TrendingUp, color: 'text-rose-400', glow: 'bg-rose-500/10' },
];

export function ActionPlan({ actionPlan }: ActionPlanProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        4-Week Execution Plan
      </h3>
      <p className="text-xs text-muted-foreground mb-5">
        A week-by-week roadmap to bring your idea to life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weeks.map((week, wi) => {
          const items = actionPlan[week.key] || [];
          return (
            <motion.div
              key={week.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wi * 0.1 }}
              className="glass rounded-xl p-4 glass-hover"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-8 w-8 rounded-lg ${week.glow} flex items-center justify-center`}>
                  <week.icon className={`h-4 w-4 ${week.color}`} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{week.title}</h4>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${week.color}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}