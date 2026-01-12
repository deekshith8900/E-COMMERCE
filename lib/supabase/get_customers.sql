-- Function to get all customers with their stats
-- Run this in Supabase SQL Editor

create or replace function get_admin_customers()
returns table (
  user_id uuid,
  email text,
  full_name text,
  total_orders bigint,
  total_spent numeric,
  last_order_date timestamptz
) 
language plpgsql
security definer
as $$
begin
  return query
  select 
    p.id as user_id,
    p.email,
    p.full_name,
    count(o.id) as total_orders,
    coalesce(sum(o.total_amount), 0) as total_spent,
    max(o.created_at) as last_order_date
  from profiles p
  left join orders o on p.id = o.user_id
  group by p.id, p.email, p.full_name
  order by total_spent desc;
end;
$$;
