CREATE TABLE public.poll_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL,
  label text NOT NULL,
  description text NOT NULL DEFAULT '',
  device_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.poll_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read poll suggestions"
  ON public.poll_suggestions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit poll suggestions"
  ON public.poll_suggestions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth manage poll suggestions"
  ON public.poll_suggestions FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_suggestions;