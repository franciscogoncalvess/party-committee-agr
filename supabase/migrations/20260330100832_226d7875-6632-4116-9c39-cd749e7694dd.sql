
-- Create tables
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  time TIME NOT NULL DEFAULT '12:00',
  location TEXT NOT NULL DEFAULT '',
  max_capacity INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  ends_at DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth manage events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read polls" ON public.polls FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth manage polls" ON public.polls FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read poll_options" ON public.poll_options FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth manage poll_options" ON public.poll_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth manage announcements" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Clear old votes (they used text IDs like "1" which won't work with new UUID-based system)
DELETE FROM public.poll_votes;
DELETE FROM public.event_rsvps;

-- Convert poll_votes and event_rsvps columns to UUID
ALTER TABLE public.poll_votes 
  ALTER COLUMN poll_id TYPE UUID USING poll_id::uuid,
  ALTER COLUMN option_id TYPE UUID USING option_id::uuid;

ALTER TABLE public.event_rsvps
  ALTER COLUMN event_id TYPE UUID USING event_id::uuid;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Seed
INSERT INTO public.announcements (title, body, date, pinned) VALUES
('📢 Welcome to AGR Party Committee!', 'This is where announcements from the Party Committee will appear. Stay tuned for updates on upcoming events, activities, and everything fun happening at AGR!', '2026-02-26', true);

INSERT INTO public.events (id, title, description, date, time, location, max_capacity) VALUES
('00000000-0000-0000-0000-000000000001', 'AGR Local — Ask Me Anything with Haukur', 'Join Haukur for an open AMA session. Bring your questions, curiosity, and good energy!', '2026-02-26', '12:00', 'AGR Office', 50);

INSERT INTO public.polls (id, question, ends_at) VALUES
('00000000-0000-0000-0000-000000000002', 'What should our next team activity be?', '2026-03-15');

INSERT INTO public.poll_options (poll_id, label, sort_order) VALUES
('00000000-0000-0000-0000-000000000002', '🏄 Surf', 0),
('00000000-0000-0000-0000-000000000002', '🎳 Bowling', 1),
('00000000-0000-0000-0000-000000000002', '🏎️ Karts', 2),
('00000000-0000-0000-0000-000000000002', '🧗 Bouldering', 3),
('00000000-0000-0000-0000-000000000002', '🧠 Quiz Game', 4),
('00000000-0000-0000-0000-000000000002', '🧘 Pilates', 5);
