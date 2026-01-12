-- Create Transactions Table
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  order_id uuid references orders(id) not null,
  provider_id text, -- Stripe PaymentIntent ID or similar
  amount decimal(10, 2) not null,
  status text not null, -- 'pending', 'success', 'failed'
  provider text default 'simulated' -- 'stripe', 'razorpay', 'simulated'
);

-- Enable RLS
alter table transactions enable row level security;

-- Policies

-- Users can view their own transactions (via order ownership)
create policy "Users can view own transactions" on transactions
  for select using (
    exists (
      select 1 from orders
      where orders.id = transactions.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all transactions
create policy "Admins can view all transactions" on transactions
  for select using (
    auth.uid() in (select id from profiles where role = 'admin')
  );
