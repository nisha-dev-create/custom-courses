-- Add separate boolean columns for liked, shared, and completed status
-- This allows users to have multiple statuses on a course simultaneously

ALTER TABLE public.user_courses 
  ADD COLUMN is_liked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN is_shared BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT false;

-- Migrate existing status data to new columns
UPDATE public.user_courses SET is_liked = true WHERE status = 'liked';
UPDATE public.user_courses SET is_shared = true WHERE status = 'shared';
UPDATE public.user_courses SET is_completed = true WHERE status = 'completed';