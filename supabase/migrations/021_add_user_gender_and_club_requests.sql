ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT '' NOT NULL;

DROP TABLE IF EXISTS public.club_requests CASCADE;

CREATE TABLE public.club_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'join',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(club_id, user_email, type)
);

ALTER TABLE public.club_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.club_requests FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.club_requests FOR INSERT WITH CHECK (true);
