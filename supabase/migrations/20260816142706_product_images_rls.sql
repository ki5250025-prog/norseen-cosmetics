create policy "Authenticated users can insert product images"
on public.product_images
for insert
to authenticated
with check (true);

create policy "Authenticated users can update product images"
on public.product_images
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete product images"
on public.product_images
for delete
to authenticated
using (true);
