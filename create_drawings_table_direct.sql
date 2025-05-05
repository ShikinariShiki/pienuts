-- Run this in the Supabase SQL Editor to create the drawings table
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'drawings' AND policyname = 'Allow anonymous insert'
  ) THEN
    CREATE POLICY "Allow anonymous insert" ON public.drawings
      FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'drawings' AND policyname = 'Allow public read'
  ) THEN
    CREATE POLICY "Allow public read" ON public.drawings
      FOR SELECT USING (true);
  END IF;
END
$$;

-- Grant permissions
GRANT ALL ON public.drawings TO postgres;
GRANT SELECT, INSERT ON public.drawings TO anon;
GRANT SELECT, INSERT ON public.drawings TO authenticated;
GRANT SELECT, INSERT ON public.drawings TO service_role;

-- Create a function to execute SQL (if needed)
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
