DROP TABLE IF EXISTS public.gor_slots CASCADE;

CREATE TABLE public.gor_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id BIGINT NOT NULL,
  court TEXT NOT NULL DEFAULT 'Lapangan 1',
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 45000,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gor_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.gor_slots FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.gor_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.gor_slots FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Izinkan Delete" ON public.gor_slots FOR DELETE USING (true);
