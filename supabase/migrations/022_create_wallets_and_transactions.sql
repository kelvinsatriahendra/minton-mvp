CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL REFERENCES users(email),
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL REFERENCES users(email),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.wallets FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Izinkan Select" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.transactions FOR INSERT WITH CHECK (true);
