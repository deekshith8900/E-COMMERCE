-- Run this in Supabase SQL Editor to fix Image Uploads

-- 1. Create the 'products' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- 2. Allow PUBLIC access to viewing images (SELECT)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- 3. Allow AUTHENTICATED users (Admins) to upload images (INSERT)
create policy "Admin Upload"
on storage.objects for insert
with check ( bucket_id = 'products' );

-- 4. Allow AUTHENTICATED users (Admins) to update images (UPDATE)
create policy "Admin Update"
on storage.objects for update
with check ( bucket_id = 'products' );
