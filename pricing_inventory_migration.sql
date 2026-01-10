-- Migration for Pricing and Inventory Tracking
-- Run this SQL script in your Supabase SQL editor AFTER the inventory_migration.sql

-- 1. Add pricing columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS price_per_book numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_price numeric(10, 2) DEFAULT 0;

-- 2. Add pricing columns to gifts table (for discounted sales)
ALTER TABLE public.gifts
ADD COLUMN IF NOT EXISTS price_per_book numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_price numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_sale boolean DEFAULT false;

-- 3. Add price_per_book to consignment_shops for tracking
ALTER TABLE public.consignment_shops
ADD COLUMN IF NOT EXISTS price_per_book numeric(10, 2) DEFAULT 0;

-- 4. Create inventory_stock table to track physical books on hand
CREATE TABLE IF NOT EXISTS public.inventory_stock (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  books_in_stock integer NOT NULL DEFAULT 0 CHECK (books_in_stock >= 0),
  last_updated timestamp with time zone DEFAULT now(),
  updated_by text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_stock_pkey PRIMARY KEY (id)
);

-- Insert initial inventory record (user will update this manually)
INSERT INTO public.inventory_stock (books_in_stock, notes)
VALUES (0, 'Initial inventory setup - Update with actual book count')
ON CONFLICT DO NOTHING;

-- 5. Enable Row Level Security
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;

-- 6. Create policy for inventory_stock
CREATE POLICY "Enable all operations for authenticated users" ON public.inventory_stock
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Create function to auto-update timestamp
CREATE OR REPLACE FUNCTION update_inventory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_timestamp
BEFORE UPDATE ON public.inventory_stock
FOR EACH ROW
EXECUTE FUNCTION update_inventory_timestamp();

-- 8. Update existing orders with default price (optional - set to 0 for now)
UPDATE public.orders
SET price_per_book = 0, total_price = 0
WHERE price_per_book IS NULL;

-- 9. Update existing gifts with default price
UPDATE public.gifts
SET price_per_book = 0, total_price = 0, is_sale = false
WHERE price_per_book IS NULL;

-- Success message
SELECT 'Pricing and inventory tracking tables updated successfully!' as message;

-- Query to verify
SELECT
  'orders' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'orders'
  AND column_name IN ('price_per_book', 'total_price')
UNION ALL
SELECT
  'gifts' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'gifts'
  AND column_name IN ('price_per_book', 'total_price', 'is_sale')
UNION ALL
SELECT
  'inventory_stock' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'inventory_stock';
