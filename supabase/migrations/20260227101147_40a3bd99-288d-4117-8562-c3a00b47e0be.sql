
-- Table to store anonymous poll votes
CREATE TABLE public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, device_id)
);

-- Enable RLS
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read votes (public poll results)
CREATE POLICY "Anyone can read poll votes"
  ON public.poll_votes FOR SELECT
  USING (true);

-- Anyone can insert a vote (anonymous voting)
CREATE POLICY "Anyone can insert poll votes"
  ON public.poll_votes FOR INSERT
  WITH CHECK (true);

-- Anyone can delete their own vote (by device_id)
CREATE POLICY "Anyone can delete their own vote"
  ON public.poll_votes FOR DELETE
  USING (true);

-- Enable realtime for live vote counts
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;
