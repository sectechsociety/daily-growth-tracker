-- Supabase Leaderboard Table Schema
-- Run this SQL in your Supabase SQL editor to create the leaderboard table

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    username TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one record per user
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON public.leaderboard (xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON public.leaderboard (level DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_last_updated ON public.leaderboard (last_updated DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow users to read all leaderboard entries (public leaderboard)
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update their own records
CREATE POLICY "Users can insert their own leaderboard entry" ON public.leaderboard
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entry" ON public.leaderboard
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own records (optional)
CREATE POLICY "Users can delete their own leaderboard entry" ON public.leaderboard
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_updated
CREATE TRIGGER trigger_update_last_updated
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

-- Grant necessary permissions
GRANT ALL ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;

-- Insert some sample data for testing (optional)
-- INSERT INTO public.leaderboard (user_id, email, username, xp, level) VALUES
--     ('550e8400-e29b-41d4-a716-446655440000', 'test1@example.com', 'Test User 1', 1500, 2),
--     ('550e8400-e29b-41d4-a716-446655440001', 'test2@example.com', 'Test User 2', 800, 1);
