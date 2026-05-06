import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import type { FinancialProjection } from '@/types/evaluation';

interface Props {
  projections: FinancialProjection[];
  breakEvenMonth: number;
}

export function ProjectionChart({ projections, breakEvenMonth }: Props) {
  if (!projections) return null;
  const formatted = projections.map((p) => ({
    ...p,
    label: `M${p.month}`,
    revenue: Math.round(p.revenue),
    expenses: Math.round(p.expenses),
    profit: Math.round(p.profit),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">24-Month P&L Projection</h3>
      <p className="text-xs text-muted-foreground mb-4">Revenue vs. expenses with break-even indicator</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152 76% 36%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(152 76% 36%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
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
          <ReferenceLine x={`M${breakEvenMonth}`} stroke="hsl(38 92% 50%)" strokeDasharray="5 5" label={{ value: 'Break-even', fill: 'hsl(38 92% 50%)', fontSize: 11 }} />
          <Area type="monotone" dataKey="revenue" stroke="hsl(152 76% 36%)" fill="url(#gradRevenue)" strokeWidth={2} name="Revenue" />
          <Area type="monotone" dataKey="expenses" stroke="hsl(0 72% 51%)" fill="url(#gradExpenses)" strokeWidth={2} name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
