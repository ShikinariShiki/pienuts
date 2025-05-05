CREATE OR REPLACE FUNCTION public.create_drawings_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'drawings'
  ) THEN
    -- Create the table
    CREATE TABLE public.drawings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      drawing_data TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add indexes
    CREATE INDEX drawings_created_at_idx ON public.drawings (created_at DESC);

    -- Set up Row Level Security (RLS)
    ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow anonymous insert" ON public.drawings
      FOR INSERT WITH CHECK (true);

    CREATE POLICY "Allow public read" ON public.drawings
      FOR SELECT USING (true);
  END IF;
END;
$$;
