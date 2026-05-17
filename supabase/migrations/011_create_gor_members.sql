DROP TABLE IF EXISTS public.gor_members CASCADE;

CREATE TABLE public.gor_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id BIGINT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Reguler',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, email)
);

ALTER TABLE public.gor_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.gor_members FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.gor_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.gor_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Izinkan Delete" ON public.gor_members FOR DELETE USING (true);
