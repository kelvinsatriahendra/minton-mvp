CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_email, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan Select" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Izinkan Insert" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan Update" ON public.notifications FOR UPDATE USING (true) WITH CHECK (true);
