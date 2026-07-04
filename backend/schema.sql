-- 1. Create the Human Review Queue Table
CREATE TABLE IF NOT EXISTS human_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_claim TEXT NOT NULL,
  ai_verdict TEXT NOT NULL,
  confidence_score INTEGER NOT NULL,
  reasoning_steps JSONB DEFAULT '[]'::jsonb,
  evidence_links JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Review Logs Table
CREATE TABLE IF NOT EXISTS review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID NOT NULL REFERENCES human_review_queue(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  moderator_id UUID, -- Optional: Link to moderator user table
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (If needed for Supabase)
ALTER TABLE human_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_logs ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Example: Allow authenticated users to read/update)
CREATE POLICY "Allow authenticated read access" ON human_review_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update access" ON human_review_queue FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert access" ON review_logs FOR INSERT TO authenticated WITH CHECK (true);
