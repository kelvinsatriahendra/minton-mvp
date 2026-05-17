DROP TABLE IF EXISTS public.gor_services CASCADE;

CREATE TABLE public.gor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'fa-solid fa-circle',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gor_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.gor_services FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.gor_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.gor_services FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Izinkan Delete" ON public.gor_services FOR DELETE USING (true);
