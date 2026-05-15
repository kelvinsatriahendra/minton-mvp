-- Jalankan SQL ini di Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_short TEXT,
  img TEXT,
  location TEXT,
  status TEXT DEFAULT 'Menunggu Pembayaran',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration TEXT,
  court TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data for testing (sesuaikan email dengan akun kamu)
INSERT INTO bookings (booking_id, user_email, venue, venue_short, img, location, status, date, time, duration, court, price) VALUES
('BS-00192', 'emailkamu@gmail.com', 'GOR Sudirman - Lapangan 3', 'GOR Sudirman', '/asset/surabaya-badminton.png', 'Surabaya, Jawa Timur', 'Terkonfirmasi', 'Jumat, 10 Mei 2024', '19:00 - 21:00', '2 Jam', 'Lapangan 3', 'Rp 140.000'),
('BS-00210', 'emailkamu@gmail.com', 'Kalam Kudus - Lapangan 1', 'Kalam Kudus', '/asset/kalam-kudus.png', 'Surakarta, Jawa Tengah', 'Terkonfirmasi', 'Minggu, 12 Mei 2024', '08:00 - 10:00', '2 Jam', 'Lapangan 1', 'Rp 100.000'),
('BS-00215', 'emailkamu@gmail.com', 'Supermash Hall - Lapangan 5', 'Supermash Hall', '/asset/supersmash-badminton-hall.png', 'Surabaya, Jawa Timur', 'Menunggu Pembayaran', 'Selasa, 14 Mei 2024', '20:00 - 21:00', '1 Jam', 'Lapangan 5', 'Rp 60.000');

CREATE TABLE IF NOT EXISTS matches (
  id BIGSERIAL PRIMARY KEY,
  venue_name TEXT NOT NULL,
  city TEXT NOT NULL,
  match_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  price_per_person INTEGER NOT NULL,
  image_url TEXT,
  slots_filled INTEGER DEFAULT 1,
  total_slots INTEGER NOT NULL,
  gender TEXT DEFAULT 'Campur',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

