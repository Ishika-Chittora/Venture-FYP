import { useMemo } from 'react';
import { useEvaluationStore } from '@/store/evaluationStore';
import type { IdeaInput } from '@/types/evaluation';

const DEFAULT_INPUT: IdeaInput = {
  name: 'Growth Lab Pool',
  description: 'Live financial tuning sample',
  industry: 'SaaS',
  targetMarket: 'SMBs',
  fundingStage: 'Seed',
  monthlyBurn: 50000,
  teamSize: 5,
  pricePerUser: 50,
  fundingAmount: 2200000,
};

const FUNDING_STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];

export function DashboardAnalyticsPanel() {
  const { input, setInput } = useEvaluationStore();
  const activeInput = input || DEFAULT_INPUT;

  const setField = <K extends keyof IdeaInput>(field: K, value: IdeaInput[K]) => {
    setInput({ ...activeInput, [field]: value });
  };

  const displayFunding = useMemo(() => activeInput.fundingAmount ?? 0, [activeInput.fundingAmount]);

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Growth Tuning</h2>
          <p className="text-sm text-muted-foreground">Adjust assumptions on the dashboard and see the lab update instantly.</p>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-muted-foreground">Monthly Burn (${activeInput.monthlyBurn.toLocaleString()})</label>
          <input
            type="range"
            min={10000}
            max={150000}
            step={5000}
            value={activeInput.monthlyBurn}
            onChange={(e) => setField('monthlyBurn', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-muted-foreground">Team Size ({activeInput.teamSize})</label>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={activeInput.teamSize}
            onChange={(e) => setField('teamSize', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-muted-foreground">Price per User (${activeInput.pricePerUser})</label>
          <input
            type="range"
            min={5}
            max={300}
            step={5}
            value={activeInput.pricePerUser}
            onChange={(e) => setField('pricePerUser', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-muted-foreground">Funding Amount (${displayFunding.toLocaleString()})</label>
          <input
            type="range"
            min={250000}
            max={60000000}
            step={250000}
            value={displayFunding}
            onChange={(e) => setField('fundingAmount', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Funding Stage</label>
            <select
              value={activeInput.fundingStage}
              onChange={(e) => setField('fundingStage', e.target.value)}
              className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              {FUNDING_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Funding Amount</label>
            <input
              type="number"
              value={displayFunding}
              onChange={(e) => setField('fundingAmount', Number(e.target.value))}
              className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
