-- Add voucher and original_price columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS original_price TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS voucher_code TEXT;
