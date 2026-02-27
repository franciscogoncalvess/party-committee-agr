
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, device_id)
);

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view RSVPs" ON public.event_rsvps FOR SELECT USING (true);
CREATE POLICY "Anyone can RSVP" ON public.event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can cancel RSVP" ON public.event_rsvps FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.event_rsvps;
