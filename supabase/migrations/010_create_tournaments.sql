DROP TABLE IF EXISTS public.tournament_registrations CASCADE;
DROP TABLE IF EXISTS public.tournaments CASCADE;

CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 32,
  slots_filled INTEGER NOT NULL DEFAULT 0,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  whatsapp TEXT,
  team_name TEXT,
  status TEXT NOT NULL DEFAULT 'terdaftar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, user_email)
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.tournaments FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.tournaments FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Izinkan Select" ON public.tournament_registrations FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.tournament_registrations FOR INSERT WITH CHECK (true);

INSERT INTO public.tournaments (badge, title, description, image_url, date, location, category, price, max_participants, slots_filled) VALUES
  ('Regional Surabaya', 'Minton Championship 2024', 'Turnamen tahunan terbesar di Surabaya, perebutkan hadiah total puluhan juta rupiah.', 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800', '20 - 22 Mei 2024', 'GOR Sudirman, Surabaya', 'Ganda Putra (Open)', 'Rp 200.000 / Tim', 32, 8),
  ('Amateur Series', 'Piala Walikota Solo', 'Ajang pencarian bakat untuk atlet muda di bawah 21 tahun.', '/asset/piala-walikota-solo.png', '05 - 07 Juni 2024', 'Kalam Kudus, Surakarta', 'Tunggal Putra (U-21)', 'Rp 150.000 / Org', 64, 12),
  ('Corporate League', 'BUMN Badminton Cup', 'Liga internal antar BUMN se-Jabodetabek. Bergengsi dan penuh persaingan sehat.', 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&q=80&w=800', '12 - 15 Juni 2024', 'Jakarta Badminton Hall', 'Beregu Campuran', 'Rp 1.500.000 / Tim', 16, 16)
ON CONFLICT DO NOTHING;
