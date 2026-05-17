-- Pastikan RLS tetap aktif
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada (supaya bisa recreate)
DROP POLICY IF EXISTS "Izinkan Select" ON public.users;
DROP POLICY IF EXISTS "Izinkan Insert" ON public.users;
DROP POLICY IF EXISTS "Izinkan Update" ON public.users;

-- Buat ulang policy
CREATE POLICY "Izinkan Select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
