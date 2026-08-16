ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS discount_percent numeric(5,2) DEFAULT 0 NOT NULL;

ALTER TABLE public.products
ADD CONSTRAINT products_discount_percent_check
CHECK (discount_percent >= 0 AND discount_percent <= 100);
