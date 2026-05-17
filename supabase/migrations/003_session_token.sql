-- Tambah kolom session_token ke users dan partners
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS session_token TEXT;

CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_token);
CREATE INDEX IF NOT EXISTS idx_partners_session ON partners(session_token);
