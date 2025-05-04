-- Create the drawings table
CREATE TABLE IF NOT EXISTS public.drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drawing_data TEXT NOT NULL,
  nickname TEXT DEFAULT 'Anonymous',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS drawings_created_at_idx ON drawings (created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous insert" ON drawings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON drawings
  FOR SELECT USING (true);
