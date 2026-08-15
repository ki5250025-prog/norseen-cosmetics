create policy "Authenticated users can insert products"
on public.products
for insert
to authenticated
with check (true);

create policy "Authenticated users can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete products"
on public.products
for delete
to authenticated
using (true);
