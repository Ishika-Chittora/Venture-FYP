import { supabase } from '@/integrations/supabase/client';
import type { EvaluationResult, IdeaInput } from '@/types/evaluation';

export async function saveEvaluation(input: IdeaInput, result: EvaluationResult) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('evaluations').insert({
    user_id: user.id,
    name: input.name,
    industry: input.industry,
    description: input.description,
    overall_score: result.overallScore,
    risk_level: result.riskLevel,
    result_json: result as any,
    input_json: input as any,
  }).select().single();

  if (error) throw error;
  return data;
}

export async function getEvaluations() {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getEvaluation(id: string) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvaluation(id: string) {
  const { error } = await supabase.from('evaluations').delete().eq('id', id);
  if (error) throw error;
}
