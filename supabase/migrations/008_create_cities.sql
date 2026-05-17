DROP TABLE IF EXISTS public.cities CASCADE;

CREATE TABLE public.cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  province TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Izinkan Select" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.cities FOR INSERT WITH CHECK (true);

INSERT INTO public.cities (name, province) VALUES
  ('Surabaya', 'Jawa Timur'),
  ('Sidoarjo', 'Jawa Timur'),
  ('Gresik', 'Jawa Timur'),
  ('Malang', 'Jawa Timur'),
  ('Mojokerto', 'Jawa Timur'),
  ('Jombang', 'Jawa Timur'),
  ('Pasuruan', 'Jawa Timur'),
  ('Probolinggo', 'Jawa Timur'),
  ('Batu', 'Jawa Timur'),
  ('Kediri', 'Jawa Timur'),
  ('Blitar', 'Jawa Timur'),
  ('Tulungagung', 'Jawa Timur'),
  ('Madiun', 'Jawa Timur'),
  ('Ngawi', 'Jawa Timur'),
  ('Ponorogo', 'Jawa Timur'),
  ('Bojonegoro', 'Jawa Timur'),
  ('Tuban', 'Jawa Timur'),
  ('Lamongan', 'Jawa Timur'),
  ('Bangkalan', 'Jawa Timur'),
  ('Jakarta', 'DKI Jakarta'),
  ('Bandung', 'Jawa Barat'),
  ('Semarang', 'Jawa Tengah'),
  ('Yogyakarta', 'DI Yogyakarta'),
  ('Denpasar', 'Bali'),
  ('Medan', 'Sumatera Utara'),
  ('Makassar', 'Sulawesi Selatan'),
  ('Palembang', 'Sumatera Selatan'),
  ('Balikpapan', 'Kalimantan Timur')
ON CONFLICT (name) DO NOTHING;
