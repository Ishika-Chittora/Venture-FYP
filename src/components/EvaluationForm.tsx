import { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import type { IdeaInput } from '@/types/evaluation';

const INDUSTRIES = ['SaaS', 'Fintech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'CleanTech', 'Other'];
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];

interface Props {
  onSubmit: (input: IdeaInput) => void;
  isLoading: boolean;
}

export function EvaluationForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<IdeaInput>({
    name: '',
    description: '',
    industry: 'SaaS',
    targetMarket: '',
    fundingStage: 'Seed',
    monthlyBurn: 50000,
    teamSize: 5,
    pricePerUser: 50,
    fundingAmount: 2200000,
  });

  const update = <K extends keyof IdeaInput>(key: K, val: IdeaInput[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.targetMarket) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Rocket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Startup Profile</h2>
          <p className="text-sm text-muted-foreground">Enter your startup details for AI analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Startup Name</label>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. QuantumPay"
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Target Market</label>
          <input
            value={form.targetMarket}
            onChange={(e) => update('targetMarket', e.target.value)}
            placeholder="e.g. SMBs in North America"
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          placeholder="Describe your startup idea, value proposition, and key differentiators..."
          className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Industry</label>
          <select
            value={form.industry}
            onChange={(e) => update('industry', e.target.value)}
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Stage</label>
          <select
            value={form.fundingStage}
            onChange={(e) => update('fundingStage', e.target.value)}
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Monthly Burn ($)</label>
          <input
            type="number"
            value={form.monthlyBurn}
            onChange={(e) => update('monthlyBurn', Number(e.target.value))}
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            min={0}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Team Size</label>
          <input
            type="number"
            value={form.teamSize}
            onChange={(e) => update('teamSize', Number(e.target.value))}
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            min={1}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Price per User ($)</label>
          <input
            type="number"
            value={form.pricePerUser}
            onChange={(e) => update('pricePerUser', Number(e.target.value))}
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            min={0}
            step={0.01}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Funding Amount ($)</label>
          <input
            type="number"
            value={form.fundingAmount}
            onChange={(e) => update('fundingAmount', Number(e.target.value))}
            className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            min={0}
            step={10000}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 glow-primary"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Evaluating...
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4" />
            Run Risk Analysis
          </>
        )}
      </button>
    </form>
  );
}
