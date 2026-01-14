-- Create Wishlist Table
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table wishlist enable row level security;

-- Policies

-- Users see their own wishlist
create policy "Users can view their own wishlist"
  on wishlist for select
  using ( auth.uid() = user_id );

-- Users can add to their wishlist
create policy "Users can add to their wishlist"
  on wishlist for insert
  with check ( auth.uid() = user_id );

-- Users can remove from their wishlist
create policy "Users can remove from their wishlist"
  on wishlist for delete
  using ( auth.uid() = user_id );
