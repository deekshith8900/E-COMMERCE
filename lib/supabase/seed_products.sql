-- 0. Clear existing products to avoid duplicates
TRUNCATE TABLE products CASCADE;

-- 1. Insert Categories (from your screenshot)
insert into categories (name, slug, description)
values
('Electronics', 'electronics', 'Latest gadgets and tech'),
('Clothing', 'clothing', 'Fashion for everyone'),
('Books', 'books', 'Read your favorite stories'),
('Wearables', 'wearables', 'Smart watches and bands'),
('Accessories', 'accessories', 'Compliment your style'),
('Furniture', 'furniture', 'Comfort for your home'),
('Home & Office', 'home-office', 'Productivity essentials'),
('Audio Devices', 'audio-devices', 'Premium sound experience')
on conflict (slug) do nothing;

-- 2. Insert Products (Using Specific Unsplash Images for Quality)
DO $$
DECLARE
    cat_electronics uuid;
    cat_clothing uuid;
    cat_books uuid;
    cat_wearables uuid;
    cat_accessories uuid;
    cat_furniture uuid;
    cat_home uuid;
    cat_audio uuid;
BEGIN
    select id into cat_electronics from categories where slug = 'electronics';
    select id into cat_clothing from categories where slug = 'clothing';
    select id into cat_books from categories where slug = 'books';
    select id into cat_wearables from categories where slug = 'wearables';
    select id into cat_accessories from categories where slug = 'accessories';
    select id into cat_furniture from categories where slug = 'furniture';
    select id into cat_home from categories where slug = 'home-office';
    select id into cat_audio from categories where slug = 'audio-devices';

    -- Electronics
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Ultra 4K Monitor', '32-inch 4K display with HDR', 399.99, 50, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', cat_electronics),
    ('Gaming Mouse Pro', 'High precision wireless mouse', 49.99, 100, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', cat_electronics),
    ('Mechanical Keyboard', 'RGB backlit mechanical keys', 89.99, 75, 'https://images.unsplash.com/photo-1587829745563-30b321527c2e?auto=format&fit=crop&w=800&q=80', cat_electronics),
    ('USB-C Hub', '7-in-1 connectivity station', 34.99, 200, 'https://images.unsplash.com/photo-1629810848834-31f7dce2632e?auto=format&fit=crop&w=800&q=80', cat_electronics),
    ('Streaming Webcam', '1080p 60fps webcam for creators', 79.99, 40, 'https://images.unsplash.com/photo-1594924765796-03da081a2578?auto=format&fit=crop&w=800&q=80', cat_electronics);

    -- Clothing
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Cotton T-Shirt', '100% organic cotton basic tee', 19.99, 500, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', cat_clothing),
    ('Slim Fit Jeans', 'Classic blue denim', 49.99, 150, 'https://images.unsplash.com/photo-1542272617-08f08630329f?auto=format&fit=crop&w=800&q=80', cat_clothing),
    ('Winter Jacket', 'Insulated waterproof jacket (Orange/Brown)', 129.99, 60, 'https://images.unsplash.com/photo-1551028919-3db0164bae5e?auto=format&fit=crop&w=800&q=80', cat_clothing),
    ('Running Shorts', 'Breathable athletic shorts', 24.99, 100, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80', cat_clothing),
    ('Casual Hoodie', 'Fleece-lined comfort hoodie', 39.99, 120, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', cat_clothing);

    -- Books
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('The Art of Code', 'Mastering software design', 29.99, 100, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', cat_books),
    ('Sci-Fi Odyssey', 'A journey through the stars', 14.99, 80, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', cat_books),
    ('History of Innovation', 'Biographies of tech giants', 24.99, 60, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80', cat_books),
    ('Modern Cooking', '100 easy recipes', 34.99, 90, 'https://images.unsplash.com/photo-1507048331197-7d4ac2e0a299?auto=format&fit=crop&w=800&q=80', cat_books),
    ('Mindfulness Guide', 'Daily meditation practices', 19.99, 120, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', cat_books);

    -- Wearables
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Smart Band 7', 'Fitness tracker with SpO2', 49.99, 200, 'https://images.unsplash.com/photo-1576243345690-8e41f0e300d8?auto=format&fit=crop&w=800&q=80', cat_wearables),
    ('Pro Watch Ultra', 'Rugged smartwatch with GPS', 299.99, 50, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', cat_wearables),
    ('Sleep Tracker Ring', 'Advanced sleep monitoring', 199.99, 40, 'https://images.unsplash.com/photo-1605100804763-ebea24d20914?auto=format&fit=crop&w=800&q=80', cat_wearables),
    ('VR Headset', 'Immersive virtual reality system', 399.99, 30, 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&w=800&q=80', cat_wearables),
    ('AR Glasses', 'Smart augmented reality glasses', 499.99, 20, 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80', cat_wearables);

    -- Accessories
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Leather Wallet', 'Genuine leather bi-fold', 39.99, 100, 'https://images.unsplash.com/photo-1627123424574-181ce5171af3?auto=format&fit=crop&w=800&q=80', cat_accessories),
    ('Sunglasses', 'Polarized UV400 lenses', 59.99, 150, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', cat_accessories),
    ('Travel Backpack', 'Water-resistant laptop bag', 79.99, 80, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', cat_accessories),
    ('Wrist Watch', 'Minimalist analog watch', 129.99, 60, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', cat_accessories),
    ('Phone Case', 'Durable shock-proof case', 19.99, 300, 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80', cat_accessories);

    -- Furniture
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Ergo Chair', 'Mesh back office chair', 199.99, 40, 'https://images.unsplash.com/photo-1596162955779-9c8f7b4d1b85?auto=format&fit=crop&w=800&q=80', cat_furniture),
    ('Standing Desk', 'Motorized sit-stand desk', 349.99, 30, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', cat_furniture),
    ('Bookshelf', '5-tier wooden display shelf', 89.99, 50, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80', cat_furniture),
    ('Bean Bag', 'Giant cozy lounge seat', 69.99, 40, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', cat_furniture),
    ('Reading Lamp', 'Adjustable LED floor lamp', 49.99, 100, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', cat_furniture);

    -- Home & Office
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Desk Organizer', 'Metal mesh desktop storage', 14.99, 200, 'https://images.unsplash.com/photo-1585155967849-91c736531406?auto=format&fit=crop&w=800&q=80', cat_home),
    ('Succulent Pot', 'Decorative ceramic planter', 9.99, 150, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', cat_home),
    ('Notebook Set', 'Premium hardcover journals', 24.99, 100, 'https://images.unsplash.com/photo-1531346878377-a513bc951a46?auto=format&fit=crop&w=800&q=80', cat_home),
    ('Whiteboard', 'Magnetic dry erase board', 39.99, 60, 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80', cat_home),
    ('Coffee Mug', 'Insulated travel tumbler', 19.99, 300, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80', cat_home);

    -- Audio Devices
    insert into products (name, description, price, stock_quantity, image_url, category_id) values
    ('Noise Cancelling Headphones', 'Over-ear premium wireless audio', 249.99, 80, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', cat_audio),
    ('Bluetooth Speaker', 'Portable waterproof speaker', 59.99, 120, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80', cat_audio),
    ('True Wireless Earbuds', 'Compact buds with charging case', 99.99, 150, 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=800&q=80', cat_audio),
    ('Vinyl Player', 'Retro turntable with bluetooth', 149.99, 40, 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80', cat_audio),
    ('Soundbar', 'TV home theater sound system', 129.99, 50, 'https://images.unsplash.com/photo-1549488352-257a965f9525?auto=format&fit=crop&w=800&q=80', cat_audio);

END $$;
