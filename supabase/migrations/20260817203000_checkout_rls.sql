-- Allow authenticated users to create their own orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Allow authenticated users to create items for their own orders
DROP POLICY IF EXISTS "Users can create items for their own orders" ON public.order_items;

CREATE POLICY "Users can create items for their own orders"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
  )
);
