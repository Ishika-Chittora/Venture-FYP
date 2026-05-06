import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Eye, EyeOff, Info, 
  Target, TrendingUp, ShieldAlert, Cpu 
} from 'lucide-react';

export function ExplainableAI({ result }: { result: any }) {
  const [expanded, setExpanded] = useState(true);

  if (!result) return null;

  // Human-readable axis names and interpretations
  const axisDetails = [
    { name: "Market Demand", weight: "30%", icon: <Target className="w-4 h-4" />, desc: "How many people are searching for this solution right now." },
    { name: "Financial Risk", weight: "25%", icon: <TrendingUp className="w-4 h-4" />, desc: "The mathematical probability of reaching break-even revenue." },
    { name: "Competitive Edge", weight: "15%", icon: <ShieldAlert className="w-4 h-4" />, desc: "Your unique advantage against existing market players." },
    { name: "Technical Feasibility", weight: "10%", icon: <Cpu className="w-4 h-4" />, desc: "The complexity and build-readiness of the proposed technology." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2rem] p-8 border border-white/10 bg-slate-900/40 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Mathematical Breakdown</h3>
            <p className="text-sm text-slate-400 font-medium">Decoding how our algorithm calculated your {result.overallScore}/100 success score.</p>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-300 transition-all border border-white/5"
        >
          {expanded ? <EyeOff size={16} /> : <Eye size={16} />}
          {expanded ? 'Hide Logic' : 'Show Logic'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {axisDetails.map((axis, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-white/5 rounded-lg text-primary">{axis.icon}</span>
                      <span className="text-lg font-bold text-white tracking-tight">{axis.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Weight: {axis.weight}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{axis.desc}</p>
                </div>
              ))}
            </div>

            {/* Formula Visualizer */}
            {/* Formula Visualizer — Updated for Visibility & Completeness */}
            <div className="mt-8 p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 relative">
            <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.3em] mb-4">
                Final Calculation Formula
            </p>
            <div className="flex flex-wrap items-center gap-3 font-mono text-lg font-bold text-slate-200">
                <span className="text-cyan-400 text-2xl">Σ</span> {/* Summation Symbol */}
                
                <span className="text-green-400">(Market × 0.3)</span> 
                <span className="text-slate-600">+</span>
                
                <span className="text-green-400">(Finance × 0.25)</span> 
                <span className="text-slate-600">+</span>
                
                <span className="text-green-400">(Competition × 0.15)</span> 
                <span className="text-slate-600">+</span>
                
                {/* Replaced '...' with Technical Feasibility */}
                <span className="text-green-400">(Technical × 0.10)</span> 
                
                <span className="text-cyan-400 italic ml-2">
                = {result.overallScore}/100
                </span>
            </div>
            
            <p className="mt-4 text-[10px] text-slate-500 italic font-medium">
                *Weights are applied based on venture capital risk-adjusted heuristic models.
            </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}