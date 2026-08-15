create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text unique not null,
  description_ar text,
  description_en text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text unique not null,
  description_ar text,
  description_en text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12,2) not null default 0,
  cost_price numeric(12,2) not null default 0,
  original_price numeric(12,2),
  stock integer not null default 0,
  low_stock_threshold integer not null default 5,
  sku text unique,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'pending',
  subtotal numeric(12,2) not null default 0,
  shipping_cost numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  product_cost numeric(12,2) not null default 0,
  notes text,
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  unit_cost numeric(12,2) not null default 0,
  total_price numeric(12,2) not null default 0
);

create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  shipping_price numeric(12,2) not null default 0,
  free_shipping_threshold numeric(12,2),
  estimated_delivery text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  amount numeric(12,2) not null default 0,
  description text,
  expense_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null,
  discount_value numeric(12,2) not null default 0,
  minimum_order numeric(12,2) default 0,
  maximum_discount numeric(12,2),
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name_ar text default 'نورسين كوزمتكس',
  store_name_en text default 'NORSEEN COSMATICS',
  logo_url text,
  phone text,
  email text,
  currency text not null default 'EGP',
  free_shipping_threshold numeric(12,2),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx
on public.products(category_id);

create index if not exists products_active_idx
on public.products(is_active);

create index if not exists orders_created_at_idx
on public.orders(created_at);

create index if not exists orders_status_idx
on public.orders(status);

create index if not exists expenses_date_idx
on public.expenses(expense_date);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.expenses enable row level security;
alter table public.coupons enable row level security;
alter table public.store_settings enable row level security;

create policy "Public can view active categories"
on public.categories
for select
using (is_active = true);

create policy "Public can view active products"
on public.products
for select
using (is_active = true);

create policy "Public can view product images"
on public.product_images
for select
using (true);

create policy "Public can view active shipping zones"
on public.shipping_zones
for select
using (is_active = true);

create policy "Public can view store settings"
on public.store_settings
for select
using (true);
