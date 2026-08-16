create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, product_id)
);

create index if not exists carts_user_id_idx
  on public.carts(user_id);

create index if not exists cart_items_cart_id_idx
  on public.cart_items(cart_id);

create index if not exists cart_items_product_id_idx
  on public.cart_items(product_id);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "Users can view their own cart" on public.carts;
create policy "Users can view their own cart"
on public.carts
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own cart" on public.carts;
create policy "Users can create their own cart"
on public.carts
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own cart" on public.carts;
create policy "Users can update their own cart"
on public.carts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own cart" on public.carts;
create policy "Users can delete their own cart"
on public.carts
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can view their cart items" on public.cart_items;
create policy "Users can view their cart items"
on public.cart_items
for select
using (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
);

drop policy if exists "Users can add to their cart" on public.cart_items;
create policy "Users can add to their cart"
on public.cart_items
for insert
with check (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
);

drop policy if exists "Users can update their cart items" on public.cart_items;
create policy "Users can update their cart items"
on public.cart_items
for update
using (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete their cart items" on public.cart_items;
create policy "Users can delete their cart items"
on public.cart_items
for delete
using (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
);
