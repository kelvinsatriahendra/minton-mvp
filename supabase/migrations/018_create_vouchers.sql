DROP TABLE IF EXISTS public.vouchers CASCADE;

CREATE TABLE public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  max_discount INTEGER,
  min_purchase INTEGER NOT NULL DEFAULT 0,
  usage_limit INTEGER NOT NULL DEFAULT 0,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Izinkan Select" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Izinkan Update" ON public.vouchers FOR UPDATE USING (true) WITH CHECK (true);

INSERT INTO public.vouchers (code, description, discount_type, discount_value, max_discount, min_purchase, usage_limit, expires_at)
VALUES
  ('DISKON10', 'Potongan 10% hingga Rp25.000', 'percentage', 10, 25000, 0, 100, '2026-12-31 23:59:59+07'),
  ('SURAKARTA15', 'Potongan Rp15.000 tanpa minimal sewa', 'fixed', 15000, NULL, 0, 50, '2026-12-31 23:59:59+07')
ON CONFLICT (code) DO NOTHING;
