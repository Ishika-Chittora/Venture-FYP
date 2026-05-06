import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Trash2, Download, Search, Loader2 } from 'lucide-react';
import { getEvaluations, deleteEvaluation } from '@/services/evaluationStorage';
import { useEvaluationStore } from '@/store/evaluationStore';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { EvaluationResult, IdeaInput } from '@/types/evaluation';

const riskColors: Record<string, string> = {
  Low: 'text-primary bg-primary/10',
  Medium: 'text-warning bg-warning/10',
  High: 'text-destructive bg-destructive/10',
  Critical: 'text-destructive bg-destructive/20',
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: getEvaluations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      toast.success('Evaluation deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = evaluations?.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (eval_: any) => {
  useEvaluationStore.setState({
    step: 'complete',
    input: eval_.input_json as unknown as IdeaInput,
    result: eval_.result_json as unknown as EvaluationResult,
    latency: null,
    error: null,
  });
  navigate('/', { state: { fromHistory: true } });
  };

  const exportCSV = () => {
    if (!evaluations?.length) return;
    const headers = ['Name', 'Industry', 'Score', 'Risk Level', 'Date'];
    const rows = evaluations.map((e) => [
      e.name,
      e.industry,
      e.overall_score,
      e.risk_level,
      new Date(e.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventureiq_evaluations.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Evaluation History</h2>
            <p className="text-xs text-muted-foreground">{evaluations?.length || 0} evaluations</p>
          </div>
        </div>
        {evaluations && evaluations.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search evaluations..."
          className="w-full rounded-xl bg-muted/30 border border-border pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !filtered?.length ? (
        <div className="glass rounded-2xl p-12 text-center">
          <History className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No evaluations yet. Run your first analysis!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((eval_, i) => (
            <motion.div
              key={eval_.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-hover rounded-xl px-4 py-3 flex items-center gap-4 cursor-pointer group"
              onClick={() => handleOpen(eval_)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{eval_.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${riskColors[eval_.risk_level]}`}>
                    {eval_.risk_level}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{eval_.industry} · {new Date(eval_.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <span className="text-lg font-bold font-mono gradient-text">{eval_.overall_score}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(eval_.id);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
