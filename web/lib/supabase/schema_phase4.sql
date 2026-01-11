-- 1. Create Orders Table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  status text not null default 'Pending', -- Pending, Processing, Shipped, Delivered, Cancelled
  total_amount decimal(10, 2) not null,
  shipping_address jsonb not null,
  payment_status text default 'Pending'
);

-- 2. Create Order Items Table
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price_at_time decimal(10, 2) not null
);

-- 3. Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- 4. Policies for Orders

-- Users can view their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

-- Users can create their own orders
create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders" on orders
  for select using (
    auth.uid() in (select id from profiles where role = 'admin')
  );

-- Admins can update orders
create policy "Admins can update orders" on orders
  for update using (
    auth.uid() in (select id from profiles where role = 'admin')
  );

-- 5. Policies for Order Items

-- Users can view their own order items
create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Users can insert items into their own orders
create policy "Users can create own order items" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
create policy "Admins can view all order items" on order_items
  for select using (
    auth.uid() in (select id from profiles where role = 'admin')
  );
