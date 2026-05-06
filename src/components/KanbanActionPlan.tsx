import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Rocket, Megaphone, TrendingUp, CheckCircle2, GripVertical } from 'lucide-react';

interface ActionPlanWeeks {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
}

interface ActionItem {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo';
  week: number;
}

interface KanbanActionPlanProps {
  actionPlan: ActionPlanWeeks | ActionItem[];
}

const weekConfig = [
  { key: 'week1' as const, title: 'Week 1: Foundation', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { key: 'week2' as const, title: 'Week 2: MVP & Validation', icon: Rocket, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  { key: 'week3' as const, title: 'Week 3: Marketing', icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { key: 'week4' as const, title: 'Week 4: Growth', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
];

function normalizeActionPlan(actionPlan: ActionPlanWeeks | ActionItem[]): ActionPlanWeeks {
  if (Array.isArray(actionPlan)) {
    return weekConfig.reduce(
      (acc, week) => ({ ...acc, [week.key]: [] }),
      { week1: [], week2: [], week3: [], week4: [] }
    ) as ActionPlanWeeks;
  }

  return {
    week1: Array.isArray(actionPlan.week1) ? actionPlan.week1 : [],
    week2: Array.isArray(actionPlan.week2) ? actionPlan.week2 : [],
    week3: Array.isArray(actionPlan.week3) ? actionPlan.week3 : [],
    week4: Array.isArray(actionPlan.week4) ? actionPlan.week4 : [],
  };
}

function expandActionItems(items: ActionItem[]): ActionPlanWeeks {
  return weekConfig.reduce(
    (acc, week) => ({ ...acc, [week.key]: [] }),
    { week1: [], week2: [], week3: [], week4: [] }
  ) as ActionPlanWeeks;
}

export function KanbanActionPlan({ actionPlan }: KanbanActionPlanProps) {
  const plan = Array.isArray(actionPlan)
    ? actionPlan.reduce((acc, item) => {
        const key = `week${item.week}` as keyof ActionPlanWeeks;
        if (acc[key]) {
          acc[key] = [...acc[key], item.task];
        }
        return acc;
      }, expandActionItems(actionPlan))
    : normalizeActionPlan(actionPlan);

  const [columns, setColumns] = useState(() => {
    return weekConfig.map(w => ({
      ...w,
      items: (plan[w.key] || []).map((text, i) => ({ id: `${w.key}-${i}`, text, done: false })),
    }));
  });

  const toggleDone = (colIdx: number, itemId: string) => {
    setColumns(prev =>
      prev.map((col, ci) =>
        ci === colIdx
          ? { ...col, items: col.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
          : col
      )
    );
  };

  const totalItems = columns.reduce((s, c) => s + c.items.length, 0);
  const doneItems = columns.reduce((s, c) => s + c.items.filter(i => i.done).length, 0);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          30-Day Execution Plan
        </h3>
        {totalItems > 0 && (
          <span className="text-xs text-muted-foreground font-mono">
            {doneItems}/{totalItems} done
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Click tasks to mark them complete. Track your progress week by week.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col, colIdx) => {
          const colDone = col.items.filter(i => i.done).length;
          const colProgress = col.items.length > 0 ? (colDone / col.items.length) * 100 : 0;

          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIdx * 0.1 }}
              className={`glass rounded-xl p-4 border ${col.border}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-7 w-7 rounded-lg ${col.bg} flex items-center justify-center`}>
                  <col.icon className={`h-3.5 w-3.5 ${col.color}`} />
                </div>
                <h4 className="text-xs font-semibold text-foreground flex-1">{col.title}</h4>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-muted/30 mb-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r from-primary to-accent`}
                  animate={{ width: `${colProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <ul className="space-y-2">
                {col.items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    className={`flex items-start gap-2 p-2 rounded-lg text-xs cursor-pointer transition group ${
                      item.done
                        ? 'bg-primary/5 text-muted-foreground line-through'
                        : 'text-foreground hover:bg-muted/20'
                    }`}
                    onClick={() => toggleDone(colIdx, item.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 transition ${
                        item.done ? 'text-primary' : `${col.color} opacity-40 group-hover:opacity-80`
                      }`}
                    />
                    <span className="flex-1 leading-relaxed">{item.text}</span>
                    <GripVertical className="h-3 w-3 text-muted-foreground/30 flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
