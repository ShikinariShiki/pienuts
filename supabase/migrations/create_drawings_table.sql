-- Create the drawings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drawing_data TEXT NOT NULL,
  nickname TEXT DEFAULT 'Anonymous',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS drawings_created_at_idx ON public.drawings (created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous insert" ON public.drawings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.drawings
  FOR SELECT USING (true);
