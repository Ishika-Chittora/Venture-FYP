import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2,
  Sigma
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, Radar 
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedSpinner } from '@/components/AnimatedSpinner';
import { ExplainableAI } from './Explainableai'; // Ensure this file exists in the same folder

// --- ANIMATION CONFIG ---
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

// --- 1. SKELETON LOADING VIEW (Prevents Blank Screen) ---
export function SkeletonLoadingView() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-center py-4">
        <AnimatedSpinner label="Synthesizing Mathematical Model..." />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    </div>
  );
}

// --- 2. MAIN DASHBOARD COMPONENT ---
export default function SkeletonDashboard({ result, isLoading }: { result?: any, isLoading?: boolean }) {
  
  // CRITICAL SAFETY GATE: If loading or data is missing, show Skeleton
  if (isLoading || !result || !result.projections || !result.reliabilityReasons) {
    return <SkeletonLoadingView />;
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20 max-w-7xl mx-auto px-4"
    >
      {/* 1. TOP METRICS: ALGORITHMIC SUMMARY */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Overall Score" value={result.overallScore} suffix="/100" />
        <MetricCard label="Risk Index" value={result.riskLevel} isText />
        <MetricCard label="Model Trust" value={result.confidenceScore} suffix="%" />
        <MetricCard label="Break-Even" value={`Month ${result.breakEvenMonth}`} isText />
      </motion.div>

      {/* 2. THE WHY FACTOR: HEURISTIC AUDIT TRAIL */}
      <motion.div 
        variants={item} 
        className="glass rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/20 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <ShieldCheck className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Logic Verification[cite: 1]</h3>
              <h2 className="text-2xl font-black text-white italic uppercase">The Why Factor[cite: 1]</h2>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.reliabilityReasons.map((reason: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-200 leading-tight">{reason}[cite: 1]</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. EXPLAINABLE AI: FORMULA BREAKDOWN[cite: 1] */}
      <motion.div variants={item}>
        <ExplainableAI result={result} />
      </motion.div>

      {/* 4. QUANTITATIVE VISUALS[cite: 1] */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl bg-slate-900/20 border border-white/10">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Geometric Growth Projection[cite: 1]
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl bg-slate-900/20 border border-white/10">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" /> Feasibility Vector[cite: 1]
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { axis: 'Market', val: result.feasibility?.market || 50 },
                { axis: 'Tech', val: result.feasibility?.technical || 50 },
                { axis: 'Finance', val: result.feasibility?.financial || 50 },
                { axis: 'Team', val: result.feasibility?.team || 50 },
                { axis: 'Timing', val: result.feasibility?.timing || 50 },
              ]}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                <Radar dataKey="val" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} strokeWidth={3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- HELPER COMPONENT ---
function MetricCard({ label, value, suffix = '', isText = false }: any) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 bg-slate-900/40 text-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
      <p className={`text-2xl font-black ${isText ? 'text-white italic tracking-tighter' : 'text-primary font-mono'}`}>
        {value}{suffix}
      </p>
    </div>
  );
}