
-- Create function to increment karma points
CREATE OR REPLACE FUNCTION public.increment_karma_points(user_id UUID, points INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update karma_points in profile, initializing to 0 if NULL
  UPDATE public.profiles
  SET karma_points = COALESCE(karma_points, 0) + points
  WHERE id = user_id;
END;
$$;

-- Create table to track help request acceptances
-- This allows tracking multiple volunteers accepting the same request
CREATE TABLE IF NOT EXISTS public.help_request_acceptances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  help_request_id UUID REFERENCES public.help_requests(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(help_request_id, volunteer_id)
);

-- Add karma_points column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS karma_points INTEGER DEFAULT 0;

-- Add is_volunteer column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_volunteer BOOLEAN DEFAULT false;

-- Enable RLS for the help_request_acceptances table
ALTER TABLE public.help_request_acceptances ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own acceptances
CREATE POLICY "Users can insert their own acceptances" 
ON public.help_request_acceptances 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = volunteer_id);

-- Create policy to allow users to view their own acceptances
CREATE POLICY "Users can view their own acceptances" 
ON public.help_request_acceptances 
FOR SELECT 
TO authenticated 
USING (auth.uid() = volunteer_id);
