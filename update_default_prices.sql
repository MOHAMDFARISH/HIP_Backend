-- Update all orders to have default price of $369 per book
-- This will set price_per_book and calculate total_price based on number_of_copies

UPDATE public.orders
SET
  price_per_book = 369.00,
  total_price = 369.00 * number_of_copies,
  updated_at = now()
WHERE price_per_book = 0 OR price_per_book IS NULL;

-- Verify the update
SELECT
  id,
  tracking_number,
  customer_name,
  number_of_copies,
  price_per_book,
  total_price,
  status
FROM public.orders
ORDER BY created_at DESC;
