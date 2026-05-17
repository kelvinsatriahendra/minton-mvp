-- Add notification_prefs column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_prefs JSONB DEFAULT '{"email_booking": true, "email_promo": true, "pengingat_jadwal": true}'::jsonb;
