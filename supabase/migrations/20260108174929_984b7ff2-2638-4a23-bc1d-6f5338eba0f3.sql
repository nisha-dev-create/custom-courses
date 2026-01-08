-- Add is_public column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_public boolean NOT NULL DEFAULT false;

-- Update RLS policy to allow viewing public profiles
CREATE POLICY "Anyone can view public profiles"
ON public.profiles
FOR SELECT
USING (is_public = true);