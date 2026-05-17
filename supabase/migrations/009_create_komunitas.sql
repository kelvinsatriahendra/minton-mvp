CREATE TABLE IF NOT EXISTS public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Campuran',
  schedule TEXT,
  fee TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_by_email TEXT REFERENCES users(email),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.clubs FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.clubs FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Izinkan Select" ON public.feed_posts FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.feed_posts FOR INSERT WITH CHECK (true);

INSERT INTO public.clubs (name, description, city, level, schedule, fee, member_count, image_url) VALUES
  ('PB Djarum Surabaya', 'Klub bulutangkis tertua dan terbesar di Surabaya.', 'Surabaya', 'Campuran', 'Sabtu & Minggu', 'Rp 50K / bln', 124, '/asset/card-komunitas1.png'),
  ('Smash Hunter SBY', 'Komunitas pemain level menengah sampai pro.', 'Surabaya', 'Menengah - Pro', 'Rabu & Jumat', 'Rp 75K / bln', 86, '/asset/card-komunitas2.png'),
  ('Badminton Lovers Sidoarjo', 'Terbuka untuk semua level, dari pemula hingga mahir.', 'Sidoarjo', 'Pemula - Menengah', 'Minggu Pagi', 'Patungan Harian', 210, '/asset/card-komunitas3.png'),
  ('Kok Terbang Club', 'Club badminton santai di kota Malang.', 'Malang', 'Campuran', 'Selasa Malam', 'Rp 40K / bln', 45, '/asset/card-komunitas4.png')
ON CONFLICT DO NOTHING;

INSERT INTO public.feed_posts (title, content, author_name, image_url) VALUES
  ('Tips Grip Raket yang Benar', 'Genggaman raket sangat menentukan kekuatan pukulan smash dan backhand kamu. Simak teknik dasar memegang raket ala atlet pro.', 'Coach Hendra', '/asset/card-artikel1.png'),
  ('Review Sepatu Badminton 2026', 'Mencari sepatu yang ringan namun empuk di pergelangan kaki? Berikut adalah komparasi top 5 sepatu badminton rilis terbaru.', 'Budi Santoso', '/asset/card-artikel2.png'),
  ('Aturan Poin Baru BWF', 'BWF merilis wacana sistem poin 5x11 menggantikan 3x21. Bagaimana pengaruhnya terhadap stamina pemain dan durasi laga?', 'Minton News', '/asset/card-artikel3.png'),
  ('Turnamen Tarkam Surabaya', 'Persiapkan tim kamu! Turnamen tahunan antar kecamatan se-Surabaya kembali digelar bulan depan. Daftarkan tim di GOR terdekat.', 'PBSI Surabaya', '/asset/card-artikel4.png'),
  ('Pemanasan Wajib Sebelum Main', 'Jangan anggap remeh cedera engkel dan lutut. Berikut 5 gerakan dinamis untuk memanaskan otot bagian bawah sebelum turun lapang.', 'Dr. Andi Sport', '/asset/card-artikel5.png'),
  ('Mitos vs Fakta Senar Raket', 'Apakah tarikan senar yang lebih kencang selalu berarti smash lebih kuat? Mari bedah fisika di balik pantulan senar raket badminton.', 'Stringer Pro ID', '/asset/card-artikel6.png')
ON CONFLICT DO NOTHING;
