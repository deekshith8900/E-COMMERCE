-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Check who you are (optional, for debugging)
select * from auth.users;

-- 2. Update your user to be an 'admin'
-- (This assumes you are the only user, or updates ALL users to admin for development)
update public.profiles
set role = 'admin';

-- 3. Verify it worked
select * from public.profiles;
