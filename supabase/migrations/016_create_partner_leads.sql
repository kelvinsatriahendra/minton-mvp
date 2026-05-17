DROP TABLE IF EXISTS public.partner_leads CASCADE;

CREATE TABLE public.partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gor_name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Izinkan Insert" ON public.partner_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Select" ON public.partner_leads FOR SELECT USING (true);
