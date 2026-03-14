
CREATE TABLE public.claim_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  claim_text TEXT,
  media_type TEXT DEFAULT 'text',
  verdict TEXT,
  risk_severity INTEGER,
  evidence JSONB,
  reasoning TEXT,
  counter_narrative TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.claim_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims" ON public.claim_history
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims" ON public.claim_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own claims" ON public.claim_history
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
