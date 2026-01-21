-- BiomeQuest Seed Data
-- Initial plants and badges

-- ============================================
-- DEFAULT ADMIN USER
-- Email: admin@biomequest.com
-- Password: admin123
-- ============================================
INSERT INTO users (username, email, password_hash, avatar_seed, is_admin) VALUES
    ('admin', 'admin@biomequest.com', '$2b$10$G0fhyy50/QAGu8LW8D1hw.kNZDz7aWTwPvoikNe46n.iwmytLqKI2', 'admin-user', 1);

-- ============================================
-- DEFAULT PLANTS (from current app)
-- ============================================
INSERT INTO plants (name, emoji, points, repeat_points, first_time_message, repeat_message) VALUES
    ('Banana', '🍌', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Apple', '🍎', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Mango', '🥭', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Orange', '🍊', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Strawberry', '🍓', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Blueberry', '🫐', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Watermelon', '🍉', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Grape', '🍇', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Pineapple', '🍍', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!'),
    ('Papaya', '🧡', 5, 1, 'Congrats! You just helped your biome with a new plant!', 'Plants are good, but diversity is KING!');

-- Additional plants for diversity
INSERT INTO plants (name, emoji, points, repeat_points, first_time_message, repeat_message) VALUES
    -- Vegetables
    ('Broccoli', '🥦', 5, 1, 'Green power! Your gut bacteria love this!', 'Keep up the veggie variety!'),
    ('Carrot', '🥕', 5, 1, 'Great choice! Carrots are fantastic for your microbiome!', 'Crunchy and healthy!'),
    ('Spinach', '🥬', 5, 1, 'Leafy greens are gut superheroes!', 'Popeye approves!'),
    ('Tomato', '🍅', 5, 1, 'Technically a fruit, always delicious!', 'Tomato power!'),
    ('Cucumber', '🥒', 5, 1, 'Cool as a cucumber, great for your gut!', 'Stay hydrated!'),
    ('Corn', '🌽', 5, 1, 'Fiber-rich and delicious!', 'Corn is always a good choice!'),
    ('Pepper', '🫑', 5, 1, 'Colorful and nutritious!', 'Peppers pack a punch!'),
    ('Eggplant', '🍆', 5, 1, 'Purple power for your gut!', 'Eggplant excellence!'),
    ('Mushroom', '🍄', 5, 1, 'Fungi are friends to your microbiome!', 'Mushroom magic!'),
    ('Onion', '🧅', 5, 1, 'Prebiotic powerhouse!', 'Layers of goodness!'),
    ('Garlic', '🧄', 5, 1, 'Incredible for gut health!', 'Garlic greatness!'),
    ('Potato', '🥔', 5, 1, 'Resistant starch for happy gut bacteria!', 'Spud success!'),
    ('Sweet Potato', '🍠', 5, 1, 'Sweet and fiber-rich!', 'Sweet choice!'),
    ('Lettuce', '🥗', 5, 1, 'Fresh greens for a fresh gut!', 'Salad superstar!'),

    -- Legumes
    ('Peanut', '🥜', 5, 1, 'Legume power! Great for diversity!', 'Nutty and nice!'),
    ('Beans', '🫘', 5, 1, 'Beans are gut bacteria favorites!', 'Bean there, love that!'),

    -- Grains
    ('Rice', '🍚', 5, 1, 'A staple for billions, great for you!', 'Rice is nice!'),
    ('Bread', '🍞', 5, 1, 'Whole grains feed your microbiome!', 'Bread for the win!'),

    -- Other fruits
    ('Cherry', '🍒', 5, 1, 'Sweet antioxidant boost!', 'Cherry on top!'),
    ('Peach', '🍑', 5, 1, 'Peachy keen for your gut!', 'Feeling peachy!'),
    ('Pear', '🍐', 5, 1, 'Fiber-filled fruit!', 'A pear-fect choice!'),
    ('Lemon', '🍋', 5, 1, 'Citrus boost for your system!', 'When life gives you lemons...'),
    ('Coconut', '🥥', 5, 1, 'Tropical gut support!', 'Coco-nutty!'),
    ('Kiwi', '🥝', 5, 1, 'Fuzzy fruit, fantastic fiber!', 'Kiwi power!'),
    ('Avocado', '🥑', 5, 1, 'Healthy fats for a happy gut!', 'Avo-mazing!'),
    ('Melon', '🍈', 5, 1, 'Refreshing and nutritious!', 'Melon-choly no more!');

-- ============================================
-- DEFAULT BADGES
-- ============================================
INSERT INTO badges (name, emoji, description, points_required, sort_order) VALUES
    ('Plant Starter', '🌱', 'Begin your plant diversity journey', 10, 1),
    ('Green Guardian', '🌿', 'Growing your gut garden', 25, 2),
    ('Nature Hero', '🌳', 'A true friend of plants', 50, 3),
    ('Biome Master', '🌲', 'Your microbiome is thriving', 100, 4),
    ('Plant Legend', '🌴', 'Ultimate plant diversity champion', 150, 5),
    ('Diversity King', '👑', 'Reached legendary diversity status', 250, 6),
    ('Gut Guru', '🧘', 'Master of microbiome balance', 500, 7),
    ('Plant Wizard', '🧙', 'Magical plant powers unlocked', 750, 8),
    ('Biome Champion', '🏆', 'Champion of gut health', 1000, 9);
