-- Create Reviews Table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating smallint check (rating >= 1 and rating <= 5) not null,
  comment text,
  
  -- Prevent multiple reviews per user per product (optional but good practice)
  constraint unique_user_product_review unique (user_id, product_id)
);

-- Enable RLS
alter table reviews enable row level security;

-- Policies
create policy "Reviews are viewable by everyone."
  on reviews for select
  using ( true );

create policy "Authenticated users can create reviews."
  on reviews for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own reviews."
  on reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews."
  on reviews for delete
  using ( auth.uid() = user_id );
