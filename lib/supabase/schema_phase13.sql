-- Create Coupons Table
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric not null check (discount_value > 0),
  min_order_amount numeric default 0,
  usage_limit int,
  usage_count int default 0,
  expires_at timestamp with time zone,
  is_active boolean default true
);

-- Enable RLS (Admins only for management, public via RPC)
alter table coupons enable row level security;

-- Only admins can view/edit coupons directly
create policy "Admins can manage coupons"
  on coupons for all
  using (
    auth.uid() in (
      select id from auth.users where email = 'admin@example.com' -- Update with your admin check logic if different
    )
  );

-- Function to Validate Coupon
create or replace function validate_coupon(
  code_input text,
  cart_total numeric
) returns json as $$
declare
  coupon_record record;
  discount_amount numeric := 0;
  final_total numeric;
begin
  -- Find coupon (case insensitive)
  select * into coupon_record
  from coupons
  where upper(code) = upper(code_input)
  and is_active = true;

  -- 1. Check if exists
  if coupon_record is null then
    return json_build_object('valid', false, 'message', 'Invalid coupon code');
  end if;

  -- 2. Check expiry
  if coupon_record.expires_at is not null and now() > coupon_record.expires_at then
    return json_build_object('valid', false, 'message', 'Coupon has expired');
  end if;

  -- 3. Check usage limit
  if coupon_record.usage_limit is not null and coupon_record.usage_count >= coupon_record.usage_limit then
    return json_build_object('valid', false, 'message', 'Coupon usage limit reached');
  end if;

  -- 4. Check min order amount
  if cart_total < coupon_record.min_order_amount then
    return json_build_object('valid', false, 'message', 'Minimum order amount not met for this coupon');
  end if;

  -- Calculate Discount
  if coupon_record.discount_type = 'percent' then
    discount_amount := (cart_total * coupon_record.discount_value) / 100;
  else
    discount_amount := coupon_record.discount_value;
  end if;

  -- Ensure discount doesn't exceed total
  if discount_amount > cart_total then
    discount_amount := cart_total;
  end if;

  return json_build_object(
    'valid', true,
    'discount_amount', discount_amount,
    'code', coupon_record.code,
    'message', 'Coupon applied successfully!'
  );
end;
$$ language plpgsql security definer;

-- Function to Increment Usage
create or replace function increment_coupon_usage(coupon_code text)
returns void as $$
begin
  update coupons
  set usage_count = usage_count + 1
  where upper(code) = upper(coupon_code);
end;
$$ language plpgsql security definer;

-- Seed some test coupons
insert into coupons (code, discount_type, discount_value, min_order_amount, usage_limit)
values
('WELCOME10', 'percent', 10, 0, null),
('SAVE20', 'fixed', 20, 50, 100),
('FLASH50', 'percent', 50, 100, 10)
on conflict (code) do nothing;
