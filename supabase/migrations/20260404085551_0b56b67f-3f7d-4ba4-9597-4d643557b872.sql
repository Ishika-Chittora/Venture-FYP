
-- Create evaluations table
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  overall_score INTEGER NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'Medium',
  result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  input_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own evaluations"
ON public.evaluations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evaluations"
ON public.evaluations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations"
ON public.evaluations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX idx_evaluations_user_id ON public.evaluations(user_id);
CREATE INDEX idx_evaluations_created_at ON public.evaluations(created_at DESC);
