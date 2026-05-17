-- Tabel peserta untuk cek duplikat join
CREATE TABLE IF NOT EXISTS match_participants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, user_email)
);

ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read match_participants"
  ON match_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own participation"
  ON match_participants FOR INSERT
  WITH CHECK (true);
