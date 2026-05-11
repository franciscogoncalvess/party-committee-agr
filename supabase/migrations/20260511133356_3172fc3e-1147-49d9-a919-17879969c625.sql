CREATE POLICY "Anyone can add poll options"
  ON public.poll_options FOR INSERT
  WITH CHECK (true);

DROP TABLE IF EXISTS public.poll_suggestions;