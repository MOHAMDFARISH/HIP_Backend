-- Migration for Inventory Management Features
-- Run this SQL script in your Supabase SQL editor to create the new tables

-- 1. Create gifts table for tracking books given as gifts
CREATE TABLE IF NOT EXISTS public.gifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  recipient_title text,
  organization text,
  number_of_books integer NOT NULL CHECK (number_of_books > 0),
  date_gifted timestamp with time zone NOT NULL DEFAULT now(),
  occasion text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT gifts_pkey PRIMARY KEY (id)
);

-- 2. Create consignment_shops table for tracking books at souvenir shops
CREATE TABLE IF NOT EXISTS public.consignment_shops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_name text NOT NULL,
  location text NOT NULL,
  contact_person text,
  contact_phone text,
  contact_email text,
  books_placed integer NOT NULL DEFAULT 0 CHECK (books_placed >= 0),
  books_sold integer NOT NULL DEFAULT 0 CHECK (books_sold >= 0),
  books_remaining integer NOT NULL DEFAULT 0 CHECK (books_remaining >= 0),
  last_payment_date timestamp with time zone,
  total_revenue numeric(10, 2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT consignment_shops_pkey PRIMARY KEY (id),
  CONSTRAINT check_books_math CHECK (books_remaining = books_placed - books_sold)
);

-- 3. Enable Row Level Security (optional but recommended)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignment_shops ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for authenticated users (adjust based on your auth setup)
-- These policies allow authenticated users to perform all operations
-- Modify these if you have specific role-based access requirements

CREATE POLICY "Enable all operations for authenticated users" ON public.gifts
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON public.consignment_shops
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gifts_date_gifted ON public.gifts(date_gifted DESC);
CREATE INDEX IF NOT EXISTS idx_gifts_recipient_name ON public.gifts(recipient_name);
CREATE INDEX IF NOT EXISTS idx_consignment_shops_shop_name ON public.consignment_shops(shop_name);

-- 6. Create a function to automatically update books_remaining
CREATE OR REPLACE FUNCTION update_books_remaining()
RETURNS TRIGGER AS $$
BEGIN
  NEW.books_remaining := NEW.books_placed - NEW.books_sold;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_books_remaining
BEFORE INSERT OR UPDATE ON public.consignment_shops
FOR EACH ROW
EXECUTE FUNCTION update_books_remaining();

-- Success message
SELECT 'Inventory management tables created successfully!' as message;
