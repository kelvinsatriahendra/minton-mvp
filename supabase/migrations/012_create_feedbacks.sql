DROP TABLE IF EXISTS public.feedbacks CASCADE;

CREATE TABLE public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id BIGINT,
  venue TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.feedbacks FOR INSERT WITH CHECK (true);
