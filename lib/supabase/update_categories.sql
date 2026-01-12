-- Insert the requested categories
-- We use ON CONFLICT (slug) DO NOTHING to prevent errors if you run this multiple times

INSERT INTO public.categories (name, slug, description)
VALUES
  ('Electronics', 'electronics', 'Gadgets, phones, and computers'),
  ('Wearables', 'wearables', 'Smartwatches and fitness trackers'),
  ('Accessories', 'accessories', 'Bags, cables, and add-ons'),
  ('Furniture', 'furniture', 'Home and office furniture'),
  ('Home & Office', 'home-office', 'Essentials for work and living'),
  ('Audio Devices', 'audio-devices', 'Headphones, speakers, and mics')
ON CONFLICT (slug) DO NOTHING;
