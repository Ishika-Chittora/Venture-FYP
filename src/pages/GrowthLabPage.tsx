import { useMemo } from 'react';
import { AreaChart, Area, Bar, CartesianGrid, ComposedChart, Legend, Line, RadialBar, RadialBarChart, ResponsiveContainer, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { useEvaluationStore } from '@/store/evaluationStore';
import { buildLiquiditySeries, buildBurnRevenueSeries, calculatePaybackMonths, buildSensitivityMatrix, findLiquidityIntersection, findMinimumLiquidityPoint } from '@/utils/analyticsEngine';

const gaugeRanges = [
  { name: 'Fast', end: 6, color: '#10B981' },
  { name: 'Target', end: 12, color: '#F59E0B' },
  { name: 'Slow', end: 24, color: '#F43F5E' },
];

function formatCurrency(value: number) {
  return `$${Math.round(value / 1000)}K`;
}

const DEFAULT_INPUT = {
  name: 'Scenario Lab',
  description: '',
  industry: 'SaaS',
  targetMarket: 'SMBs',
  fundingStage: 'Seed',
  monthlyBurn: 50000,
  teamSize: 5,
  pricePerUser: 50,
  fundingAmount: 2200000,
};

export default function GrowthLabPage() {
  const { input } = useEvaluationStore();
  const activeInput = {
    ...DEFAULT_INPUT,
    ...input,
    fundingStage: String(input?.fundingStage ?? DEFAULT_INPUT.fundingStage),
    monthlyBurn: Number(input?.monthlyBurn ?? DEFAULT_INPUT.monthlyBurn),
    teamSize: Number(input?.teamSize ?? DEFAULT_INPUT.teamSize),
    pricePerUser: Number(input?.pricePerUser ?? DEFAULT_INPUT.pricePerUser),
    fundingAmount: Number(input?.fundingAmount ?? DEFAULT_INPUT.fundingAmount),
  };

  const liquiditySeries = useMemo(() => buildLiquiditySeries(activeInput, 24), [activeInput]);
  const burnRevenueSeries = useMemo(() => buildBurnRevenueSeries(activeInput, 24), [activeInput]);
  const paybackMonths = useMemo(() => calculatePaybackMonths(activeInput), [activeInput]);
  const sensitivityData = useMemo(() => buildSensitivityMatrix(activeInput), [activeInput]);
  const intersectionMonth = useMemo(() => findLiquidityIntersection(liquiditySeries), [liquiditySeries]);
  const minLiquidityPoint = useMemo(() => findMinimumLiquidityPoint(liquiditySeries), [liquiditySeries]);
  const paybackColor = paybackMonths > 12 ? '#F43F5E' : '#10B981';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Advanced Analytics</p>
          <h1 className="text-3xl font-black text-foreground">Growth & Efficiency Lab</h1>
          <p className="max-w-2xl text-sm text-muted-foreground mt-2">
            Real-time financial metrics from live inputs. This page computes cash liquidity, CAC payback, monthly burn/revenue dynamics, and sensitivity outcomes without AI.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-background/80 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Live input snapshot</p>
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            <div><span className="block text-muted-foreground">Monthly Burn</span><strong>${activeInput.monthlyBurn.toLocaleString()}</strong></div>
            <div><span className="block text-muted-foreground">Price / User</span><strong>${activeInput.pricePerUser}</strong></div>
            <div><span className="block text-muted-foreground">Team Size</span><strong>{activeInput.teamSize}</strong></div>
            <div><span className="block text-muted-foreground">Funding</span><strong>${activeInput.fundingAmount.toLocaleString()}</strong></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Cumulative Cash Liquidity</p>
              <h2 className="text-xl font-semibold text-foreground">Valley of Death mapped</h2>
            </div>
            {intersectionMonth ? (
              <div className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-red-500">
                Funding intersection: month {intersectionMonth}
              </div>
            ) : (
              <div className="rounded-2xl bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300">
                No funding intersection in 24 months
              </div>
            )}
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liquiditySeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(138, 54%, 43%)', fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}K`} tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222 59% 5%)', border: '1px solid hsl(217 33% 22%)', borderRadius: 10 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Liquidity']}
                />
                <Area type="monotone" dataKey="cashLiquidity" stroke="#10B981" fill="url(#liquidityGradient)" strokeWidth={3} />
                <Line type="monotone" dataKey="fundingAmount" stroke="#38BDF8" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                <ReferenceLine y={0} stroke="#F43F5E" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-rose-200 p-4 border border-white/5">
              <p className="font-semibold text-foreground">Lowest liquidity</p>
              <p className="mt-2">Month {minLiquidityPoint.month}</p>
              <p className="text-foreground">${minLiquidityPoint.cashLiquidity.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-rose-200 p-4 border border-white/5">
              <p className="font-semibold text-foreground">Total funding</p>
              <p className="mt-2 text-foreground">${minLiquidityPoint.fundingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">CAC Payback Velocity</p>
              <h2 className="text-xl font-semibold text-foreground">Payback period</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${paybackMonths > 12 ? 'bg-rose-500/15 text-rose-200' : 'bg-emerald-500/15 text-red-500'}`}>
              {paybackMonths} months
            </span>
          </div>

          <div className="h-[330px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={18} data={[{ name: 'Payback', value: Math.min(paybackMonths, 24), fill: paybackColor }, { name: 'Remaining', value: 24 - Math.min(paybackMonths, 24), fill: '#1F2937' }]} startAngle={180} endAngle={0}>
                <RadialBar minAngle={15} dataKey="value" cornerRadius={12} background clockWise />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This gauge compares calculated CAC payback velocity against a 12-month VC threshold. Red indicates a slower than ideal payback schedule.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Burn vs Revenue</p>
              <h2 className="text-xl font-semibold text-foreground">Cost and income convergence</h2>
            </div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={burnRevenueSeries} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} tickFormatter={(value) => `$${Math.round(value / 1000)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(215 20% 45%)', fontSize: 11 }} tickFormatter={(value) => `$${Math.round(value / 1000)}K`} />
                <Tooltip contentStyle={{ background: 'hsl(222 59% 5%)', border: '1px solid hsl(217 33% 22%)', borderRadius: 10 }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="monthlyBurn" fill="#F43F5E" radius={[8, 8, 0, 0]} name="Monthly Burn" />
                <Line yAxisId="right" type="monotone" dataKey="monthlyRevenue" stroke="#10B981" strokeWidth={3} dot={false} name="Monthly Revenue" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Sensitivity Heatmap</p>
              <h2 className="text-xl font-semibold text-foreground">Price vs conversion break-even</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-2 text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs uppercase tracking-[0.24em] text-muted-foreground">Price / Conv</th>
                  {[...new Set(sensitivityData.map((item) => item.conversion))].map((conversion) => (
                    <th key={conversion} className="p-2 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">{(conversion * 100).toFixed(1)}%</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(sensitivityData.map((item) => item.price))).map((price) => (
                  <tr key={price}>
                    <td className="p-2 font-semibold text-foreground">${price}</td>
                    {sensitivityData.filter((item) => item.price === price).map((item) => {
                      const score = item.breakEvenMonth;
                      const color = score <= 12 ? 'bg-emerald-500/20 text-emerald-200' : score <= 18 ? 'bg-amber-500/20 text-amber-200' : 'bg-rose-500/20 text-black-400';
                      return (
                        <td key={item.conversion} className={`p-2 text-center rounded-2xl ${color}`}>
                          {score}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Each cell represents a different break-even scenario across price and conversion performance. Lower values are stronger efficiency outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
