CREATE POLICY "Authenticated users can insert shipping zones"
ON public.shipping_zones
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update shipping zones"
ON public.shipping_zones
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shipping zones"
ON public.shipping_zones
FOR DELETE
TO authenticated
USING (true);
