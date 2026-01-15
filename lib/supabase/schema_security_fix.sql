-- 1. Create a Secure Helper Function to check Admin Role
-- usage of SECURITY DEFINER allows this function to bypass RLS, avoiding infinite recursion
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$;

-- 2. Secure Profiles Table
alter table profiles enable row level security;

-- Drop insecure "view everyone" policy
drop policy if exists "Public profiles are viewable by everyone." on profiles;
-- Drop other existing policies to be safe/clean
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Admins can update all profiles" on profiles;

-- Create Policies
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Admins can view all profiles"
  on profiles for select
  using ( is_admin() );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Admins can update all profiles"
  on profiles for update
  using ( is_admin() );

-- 3. Secure Orders Table (Update existing policies to use is_admin function for consistency)
-- (We assume orders RLS is already active, but let's refresh policies)

drop policy if exists "Admins can view all orders" on orders;
create policy "Admins can view all orders"
  on orders for select
  using ( is_admin() );

drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders"
  on orders for update
  using ( is_admin() );
