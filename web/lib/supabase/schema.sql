-- 1. Create Profile Table (Safe if exists)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'customer')) default 'customer',
  
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable RLS (Safe to run multiple times)
alter table profiles enable row level security;

-- 3. Create Policies (Drop first to avoid errors on re-run)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create Function (OR REPLACE fixes the "already exists" error)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'customer')
  on conflict (id) do nothing; -- Prevents error if profile already exists
  return new;
end;
$$;

-- 5. Create Trigger (Drop first to ensure clean state)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
