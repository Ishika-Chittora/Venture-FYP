import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Slider } from '@/components/ui/slider';
import type { FinancialProjection } from '@/types/evaluation';
import { motion } from 'framer-motion';

interface Props {
  baseProjections: FinancialProjection[];
  baseBurn: number;
  baseBreakEven: number;
}

export function SensitivityAnalysis({ baseProjections, baseBurn, baseBreakEven }: Props) {
  if (!baseProjections) return null;
  const [burnAdjust, setBurnAdjust] = useState(0);
  const [priceAdjust, setPriceAdjust] = useState(0);

  const { projections, breakEven } = useMemo(() => {
    const burnMultiplier = 1 + burnAdjust / 100;
    const revenueMultiplier = 1 + priceAdjust / 100;

    const adjusted = baseProjections.map((p) => {
      const expenses = Math.round(p.expenses * burnMultiplier);
      const revenue = Math.round(p.revenue * revenueMultiplier);
      return {
        ...p,
        label: `M${p.month}`,
        expenses,
        revenue,
        profit: revenue - expenses,
      };
    });

    const be = adjusted.findIndex((p) => p.profit >= 0) + 1;
    return { projections: adjusted, breakEven: be || 24 };
  }, [baseProjections, burnAdjust, priceAdjust]);

  const shiftLabel = (v: number) => (v >= 0 ? `+${v}%` : `${v}%`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">What-If Sensitivity Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Adjust Monthly Burn</label>
            <span className="text-sm font-mono font-semibold text-foreground">{shiftLabel(burnAdjust)}</span>
          </div>
          <Slider
            value={[burnAdjust]}
            onValueChange={([v]) => setBurnAdjust(v)}
            min={-50}
            max={100}
            step={5}
          />
          <p className="text-xs text-muted-foreground">
            ${Math.round(baseBurn * (1 + burnAdjust / 100)).toLocaleString()}/mo
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Adjust Price per User</label>
            <span className="text-sm font-mono font-semibold text-foreground">{shiftLabel(priceAdjust)}</span>
          </div>
          <Slider
            value={[priceAdjust]}
            onValueChange={([v]) => setPriceAdjust(v)}
            min={-50}
            max={100}
            step={5}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="px-3 py-1.5 rounded-lg bg-muted/30 text-xs">
          <span className="text-muted-foreground">Original Break-even: </span>
          <span className="font-mono font-semibold text-foreground">Month {baseBreakEven}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-xs border border-primary/20">
          <span className="text-muted-foreground">Adjusted Break-even: </span>
          <span className="font-mono font-semibold text-primary">Month {breakEven}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={projections} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRevSim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152 76% 36%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(152 76% 36%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpSim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0 72% 51%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0 72% 51%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 16%)" />
          <XAxis dataKey="label" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} interval={2} />
          <YAxis tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
          <Tooltip
            contentStyle={{
              background: 'hsl(222 59% 5%)',
              border: '1px solid hsl(217 33% 22%)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <ReferenceLine x={`M${breakEven}`} stroke="hsl(38 92% 50%)" strokeDasharray="5 5" label={{ value: 'Break-even', fill: 'hsl(38 92% 50%)', fontSize: 11 }} />
          <Area type="monotone" dataKey="revenue" stroke="hsl(152 76% 36%)" fill="url(#gradRevSim)" strokeWidth={2} name="Revenue" />
          <Area type="monotone" dataKey="expenses" stroke="hsl(0 72% 51%)" fill="url(#gradExpSim)" strokeWidth={2} name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
