-- 1. Create Categories Table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  slug text unique not null,
  description text
);

-- 2. Create Products Table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  name text not null,
  description text,
  price decimal(10, 2) not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_url text,
  category_id uuid references categories(id) on delete set null,
  is_active boolean default true
);

-- 3. Enable RLS
alter table categories enable row level security;
alter table products enable row level security;

-- 4. RLS Policies for Categories
-- Everyone can read categories
drop policy if exists "Categories are viewable by everyone" on categories;
create policy "Categories are viewable by everyone"
  on categories for select
  using ( true );

-- Only Admins can insert/update/delete (Check profiles role)
drop policy if exists "Admins can manage categories" on categories;
create policy "Admins can manage categories"
  on categories for all
  using (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

-- 5. RLS Policies for Products
-- Everyone can read active products
drop policy if exists "Products are viewable by everyone" on products;
create policy "Products are viewable by everyone"
  on products for select
  using ( true );

-- Only Admins can insert/update/delete
drop policy if exists "Admins can manage products" on products;
create policy "Admins can manage products"
  on products for all
  using (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

-- 6. Insert Default Categories (Optional helper)
insert into categories (name, slug, description)
values
('Electronics', 'electronics', 'Gadgets and devices'),
('Clothing', 'clothing', 'Apparel for men and women'),
('Books', 'books', 'Fiction and non-fiction')
on conflict (slug) do nothing;
