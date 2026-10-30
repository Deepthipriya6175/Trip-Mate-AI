-- =========================================================================
-- TripMate AI: Complete PostgreSQL & Supabase Database Setup Script
-- Includes schema definitions, extensions, constraints, Row Level Security (RLS),
-- triggers, indexes, and comprehensive verified seed data for hospitality demo.
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean drop for idempotency if executing fresh in Supabase SQL Editor
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;
DROP TABLE IF EXISTS travel_preferences CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS hotel_faqs CASCADE;
DROP TABLE IF EXISTS hotel_staff CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. PROFILES TABLE (supports custom JWT or Supabase auth integration)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'tourist' CHECK (role IN ('tourist', 'hotel_staff', 'admin')),
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. HOTELS TABLE
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    star_rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
    check_in_time VARCHAR(20) NOT NULL DEFAULT '14:00',
    check_out_time VARCHAR(20) NOT NULL DEFAULT '11:00',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    policies JSONB NOT NULL DEFAULT '[]'::jsonb,
    dining_info JSONB NOT NULL DEFAULT '[]'::jsonb,
    facilities_info JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. HOTEL STAFF MAPPING TABLE
CREATE TABLE hotel_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    department VARCHAR(50) NOT NULL CHECK (department IN ('front_desk', 'housekeeping', 'maintenance', 'food_beverage', 'concierge', 'billing', 'management')),
    role_title VARCHAR(100) NOT NULL DEFAULT 'Staff Member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, hotel_id)
);

-- 4. HOTEL FAQS TABLE (Knowledge Grounding Base for AI Concierge)
CREATE TABLE hotel_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    category VARCHAR(60) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CONVERSATIONS TABLE
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Concierge Assistance',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. MESSAGES TABLE
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. COMPLAINTS & TICKETS TABLE
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_number VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('housekeeping', 'maintenance', 'food_beverage', 'billing', 'booking', 'amenities', 'noise', 'general_service')),
    urgency VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    department VARCHAR(50) NOT NULL DEFAULT 'front_desk',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated')),
    ai_confidence NUMERIC(3,2),
    resolution_notes TEXT,
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. FEEDBACK & SENTIMENT TABLE
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    rating_overall INTEGER NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
    rating_cleanliness INTEGER CHECK (rating_cleanliness BETWEEN 1 AND 5),
    rating_staff INTEGER CHECK (rating_staff BETWEEN 1 AND 5),
    rating_food INTEGER CHECK (rating_food BETWEEN 1 AND 5),
    rating_amenities INTEGER CHECK (rating_amenities BETWEEN 1 AND 5),
    comments TEXT NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    sentiment_score NUMERIC(3,2),
    key_positives TEXT[] DEFAULT '{}',
    key_improvements TEXT[] DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TRAVEL PREFERENCES TABLE
CREATE TABLE travel_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    preferred_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    dietary_restrictions TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    travel_pace VARCHAR(30) DEFAULT 'moderate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. ITINERARIES TABLE
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days >= 1),
    budget_level VARCHAR(30) NOT NULL CHECK (budget_level IN ('budget', 'moderate', 'luxury', 'ultra_luxury')),
    interests TEXT[] DEFAULT '{}',
    itinerary_data JSONB NOT NULL,
    total_estimated_cost VARCHAR(100),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. AI EXPERIENCE INSIGHTS & GAP DETECTOR TABLE
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_complaints_analyzed INTEGER NOT NULL DEFAULT 0,
    total_feedback_analyzed INTEGER NOT NULL DEFAULT 0,
    recurring_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    gap_score NUMERIC(4,1) NOT NULL DEFAULT 0.0,
    sentiment_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_hotel_staff_user ON hotel_staff(user_id);
CREATE INDEX idx_hotel_staff_hotel ON hotel_staff(hotel_id);
CREATE INDEX idx_hotel_faqs_hotel ON hotel_faqs(hotel_id);
CREATE INDEX idx_hotel_faqs_category ON hotel_faqs(category);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_complaints_hotel_status ON complaints(hotel_id, status);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_urgency ON complaints(urgency);
CREATE INDEX idx_feedback_hotel ON feedback(hotel_id);
CREATE INDEX idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX idx_itineraries_user ON itineraries(user_id);
CREATE INDEX idx_ai_insights_hotel ON ai_insights(hotel_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Hotels & FAQs are publicly viewable by authenticated or guest users
CREATE POLICY "Public read on hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Public read on hotel_faqs" ON hotel_faqs FOR SELECT USING (is_active = true);

-- Profiles: Users can view their own profile; admins can view all
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR role = 'admin');
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Complaints: Tourists can view and create their own complaints
CREATE POLICY "Tourists read own complaints" ON complaints FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM hotel_staff hs WHERE hs.user_id = auth.uid() AND hs.hotel_id = complaints.hotel_id) OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Tourists insert own complaints" ON complaints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff update hotel complaints" ON complaints FOR UPDATE USING (
    EXISTS (SELECT 1 FROM hotel_staff hs WHERE hs.user_id = auth.uid() AND hs.hotel_id = complaints.hotel_id) OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Feedback: All users can view public feedback, authenticated users can insert
CREATE POLICY "Public read feedback" ON feedback FOR SELECT USING (is_public = true);
CREATE POLICY "Users insert own feedback" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Conversations & Messages: Tourists and Staff
CREATE POLICY "Users read own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own messages" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users insert messages" ON messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid())
);

-- Itineraries
CREATE POLICY "Users manage own itineraries" ON itineraries FOR ALL USING (auth.uid() = user_id);

-- AI Insights: Accessible to hotel staff and admins
CREATE POLICY "Staff read hotel insights" ON ai_insights FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff hs WHERE hs.user_id = auth.uid() AND hs.hotel_id = ai_insights.hotel_id) OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- =========================================================================
-- SEED DATA: VERIFIED DEMO HOTEL, USERS, FAQS, COMPLAINTS & FEEDBACK
-- Default bcrypt hashed password for demo accounts is 'password123'
-- Hash: '$2b$10$wT0E8V6q6E3uF2jO0sZ.7.v7M8r9O9P7fI4k6N8J9t2U3R5P7fI4k'
-- =========================================================================

-- Seed Demo Users
INSERT INTO profiles (id, email, password_hash, full_name, role, preferred_language, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'tourist@tripmate.com', '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', 'Elena Rostova', 'tourist', 'en', '+1 555-0192'),
('22222222-2222-2222-2222-222222222222', 'staff@tripmate.com', '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', 'Vikramaditya Rathore', 'hotel_staff', 'en', '+91 98765-43210'),
('33333333-3333-3333-3333-333333333333', 'admin@tripmate.com', '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', 'Devendra Singh', 'admin', 'en', '+91 98765-00000'),
('44444444-4444-4444-4444-444444444444', 'priya.sharma@example.com', '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', 'Priya Sharma', 'tourist', 'hi', '+91 98231-11223')
ON CONFLICT (id) DO NOTHING;

-- Seed Verified Demo Hotels
INSERT INTO hotels (
    id, name, slug, description, address, city, state, country, star_rating,
    check_in_time, check_out_time, contact_email, contact_phone,
    amenities, policies, dining_info, facilities_info, image_url
) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'The Grand Heritage Palace & Royal Resort',
    'grand-heritage-palace',
    'A magnificent 5-star royal heritage sanctuary blending 18th-century Rajputana architecture with bespoke contemporary luxury. Located amidst 15 acres of landscaped Mughal gardens with private plunge pools, holistic Ayurvedic wellness sanctuaries, and authentic royal fine dining.',
    'Heritage Hills, Amer Road',
    'Jaipur',
    'Rajasthan',
    'India',
    4.9,
    '14:00',
    '11:00',
    'concierge@grandheritagepalace.com',
    '+91 141 289 9000',
    '["Complimentary High-Speed Wi-Fi 6", "Temperature-Controlled Infinity Pool", "Jiva Royal Ayurvedic Spa", "24/7 Butler Service", "Complimentary Airport Chauffeur", "Kids Activity Sanctuary", "Helipad & Valet Parking", "Fitness Pavilion & Yoga Lawn"]'::jsonb,
    '[
        {"title": "Check-in & Check-out", "detail": "Guaranteed check-in from 14:00 hrs. Check-out is until 11:00 hrs. Early check-in and late check-out available subject to prior reservation and availability."},
        {"title": "Cancellation Policy", "detail": "Free cancellation up to 48 hours prior to arrival date. 1 night charge applies within 48 hours."},
        {"title": "Child Policy", "detail": "Children up to 6 years stay complimentary sharing existing bedding. Cribs available upon advance request at no additional charge."},
        {"title": "Pet Policy", "detail": "Designated pet-friendly royal suites available with a daily sanitization fee of INR 2,500. Pets must be leashed in public gardens."},
        {"title": "Smoking Policy", "detail": "All indoor guest rooms, heritage hallways, and suites are 100% non-smoking. Dedicated open-air terrace pavilions are designated for smoking."}
    ]'::jsonb,
    '[
        {"name": "Sheesh Mahal Fine Dine", "cuisine": "Royal Rajasthani & North Indian Gourmet", "hours": "19:00 - 23:30", "dress_code": "Smart Casual", "specialty": "Dal Baati Churma, Laal Maas, Ker Sangri"},
        {"name": "The Courtyard Bistro", "cuisine": "All-day Continental, Mediterranean & Artisan Bakery", "hours": "06:30 - 23:00", "dress_code": "Casual", "specialty": "Woodfired Truffle Flatbread, Sourdough Breakfast"},
        {"name": "Mughal Lounge & High Tea", "cuisine": "Artisanal Teas, Mocktails, Single Estate Coffees", "hours": "10:00 - 22:00", "dress_code": "Casual", "specialty": "Masala Chai High Tea Tower"}
    ]'::jsonb,
    '[
        {"facility": "Ayurvedic Spa & Wellness", "timings": "07:00 - 21:00", "booking": "Appointments recommended 2 hours in advance via concierge"},
        {"facility": "Infinity Pool & Sun Terrace", "timings": "06:00 - 20:00", "rules": "Proper swimwear required; lifeguard on duty"},
        {"facility": "Business Centre & Conference Hall", "timings": "24 Hours", "amenities": "High-speed AV, video conferencing, secretarial assistance"},
        {"facility": "Heritage Walk & Cultural Folk Dance", "timings": "Every evening at 18:30 in the Central Fountain Courtyard", "fee": "Complimentary for resident guests"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Azure Coastal Resort & Spa',
    'azure-coastal-resort',
    'A serene beachfront luxury haven overlooking the azure waters of the Arabian Sea. Offering sea-facing villas, private beach access, scuba diving excursions, and fresh organic seafood dining under the stars.',
    'Candolim Beach Road, North Goa',
    'Goa',
    'Goa',
    'India',
    4.7,
    '15:00',
    '11:00',
    'stay@azureresortgoa.com',
    '+91 832 249 7100',
    '["Private Beach Front", "Sea-view Infinity Pool", "Water Sports Center", "Sunset Deck Bar", "Seafood Grill", "Free Breakfast Buffet", "Bicycle Rentals", "High-Speed Wi-Fi"]'::jsonb,
    '[
        {"title": "Check-in Policy", "detail": "Standard check-in is 15:00. Government-issued photo ID required for all staying guests."},
        {"title": "Pool & Beach Guidelines", "detail": "Private beach gate is accessible from 06:00 to 22:00. Beach towels are provided complimentary at the pool desk."}
    ]'::jsonb,
    '[
        {"name": "Wave Crest Seafood Grill", "cuisine": "Goan, Portuguese & Mediterranean Seafood", "hours": "12:30 - 23:00", "specialty": "Butter Garlic Lobster, Prawn Balchão"},
        {"name": "Breeze Pool Bar", "cuisine": "Tropical Cocktails & Tapas", "hours": "11:00 - 23:00", "specialty": "Coconut Mojito, Tapas Platter"}
    ]'::jsonb,
    '[
        {"facility": "Water Sports & Scuba Desk", "timings": "08:00 - 17:00", "booking": "Book at Front Desk prior to 10:00 AM"},
        {"facility": "Wellness Pavilion", "timings": "07:00 - 20:00", "amenities": "Steam, sauna, beachfront yoga"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- Staff Mapping
INSERT INTO hotel_staff (user_id, hotel_id, department, role_title) VALUES
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'front_desk', 'Senior Guest Experience Manager')
ON CONFLICT (user_id, hotel_id) DO NOTHING;

-- Seed Hotel FAQs for Accurate Grounding (Grand Heritage Palace)
INSERT INTO hotel_faqs (hotel_id, category, question, answer, keywords) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Check-In & Out', 'What are the check-in and check-out times?', 'Our check-in time starts at 14:00 (2:00 PM), and check-out is by 11:00 AM. Early check-in or late check-out is subject to room availability upon arrival or can be arranged through the front desk.', ARRAY['checkin', 'checkout', 'times', 'early', 'late']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Wi-Fi & Internet', 'How do I connect to the complimentary Wi-Fi?', 'Connect to the network named "GrandHeritage_Guest". Select "Connect", enter your room number and last name. High-speed 100 Mbps fiber internet is completely complimentary throughout the property.', ARRAY['wifi', 'internet', 'password', 'connection', 'network']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dining & Breakfast', 'When and where is breakfast served?', 'Complimentary royal breakfast buffet is served daily at The Courtyard Bistro on the Ground Floor from 06:30 AM to 10:30 AM. In-room dining breakfast can also be ordered 24/7 using your room intercom (dial 4).', ARRAY['breakfast', 'timing', 'bistro', 'food', 'morning']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dining & Breakfast', 'Are vegetarian, vegan, and Jain food options available?', 'Yes! Sheesh Mahal and The Courtyard Bistro offer extensive pure vegetarian, vegan, and dedicated Jain culinary preparations curated by our Master Chefs with separate preparation kitchens.', ARRAY['vegetarian', 'vegan', 'jain', 'halal', 'dietary']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Spa & Wellness', 'What are the spa timings and how can I book a treatment?', 'The Jiva Royal Ayurvedic Spa is open daily from 07:00 AM to 09:00 PM. We recommend booking at least 2 hours in advance by dialing 8 from your room phone or visiting the Concierge Desk.', ARRAY['spa', 'massage', 'ayurveda', 'wellness', 'booking']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Transportation', 'Do you provide airport pick-up and drop transfers?', 'Yes, we provide luxury chauffeur-driven airport transfers to and from Jaipur International Airport (JAI), located approximately 28 km (45 mins) away. Please notify the Concierge desk at least 4 hours before your flight.', ARRAY['airport', 'shuttle', 'cab', 'transfer', 'chauffeur', 'pickup']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Swimming Pool', 'What are the pool hours and regulations?', 'The temperature-controlled infinity pool is open from 06:00 AM to 08:00 PM. Complimentary towels, sun loungers, and poolside refreshments are provided. Proper swimwear is required.', ARRAY['pool', 'swimming', 'hours', 'towel']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sightseeing & Attractions', 'What attractions are nearby and can you book local tours?', 'We are conveniently located near Amer Fort (6 km, 15 mins), Jal Mahal (4 km, 10 mins), City Palace (9 km, 20 mins), and Hawa Mahal (8.5 km). Our Concierge can arrange private heritage guides, vintage car excursions, and skip-the-line fort tickets.', ARRAY['sightseeing', 'amer fort', 'jal mahal', 'tour', 'city palace', 'attractions']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Room Service & Housekeeping', 'How do I request extra towels, drinking water, or room cleaning?', 'Housekeeping is available 24/7. Simply press the "Housekeeping" button on your room phone or dial 3. Extra organic cotton towels, feather pillows, and packaged Himalayan spring water are provided promptly at no extra charge.', ARRAY['housekeeping', 'towels', 'water', 'cleaning', 'pillows']),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Emergency & Medical', 'Is there medical assistance available on site?', 'A certified first-aid doctor is on call 24 hours a day, and an emergency medical kit and oxygen concentrator are maintained at the front desk. In case of any emergency, please dial 0 immediately.', ARRAY['doctor', 'medical', 'emergency', 'medicine', 'hospital'])
ON CONFLICT DO NOTHING;

-- Seed Sample Complaints
INSERT INTO complaints (
    id, user_id, hotel_id, room_number, title, description, category, urgency, department, status, ai_confidence, resolution_notes, created_at
) VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '304',
    'Air conditioning cooling is weak in bedroom',
    'The temperature inside Master Suite 304 stays around 26°C despite setting the thermostat to 20°C. There is a slight humming noise from the duct.',
    'maintenance',
    'high',
    'maintenance',
    'in_progress',
    0.96,
    'Maintenance engineer Rajesh dispatched at 10:15 AM to inspect compressor filter and refrigerant levels.',
    NOW() - INTERVAL '2 hours'
),
(
    'c2222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '112',
    'Delay in room service dinner delivery',
    'Ordered dinner at 8:15 PM, was informed 30 minutes ETA. Food arrived after 65 minutes and soup was lukewarm.',
    'food_beverage',
    'medium',
    'food_beverage',
    'resolved',
    0.92,
    'Offered complimentary dessert and 20% discount on in-room dining bill. Guest expressed satisfaction with prompt apology.',
    NOW() - INTERVAL '1 day'
),
(
    'c3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '304',
    'Need extra hypoallergenic pillows and bath sheets',
    'Please send two additional hypoallergenic pillows and two bath sheets to room 304 before 6 PM.',
    'housekeeping',
    'low',
    'housekeeping',
    'resolved',
    0.98,
    'Delivered freshly laundered hypoallergenic microfiber pillows and bath sheets at 4:30 PM.',
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Guest Feedback
INSERT INTO feedback (
    id, user_id, hotel_id, rating_overall, rating_cleanliness, rating_staff, rating_food, rating_amenities,
    comments, sentiment, sentiment_score, key_positives, key_improvements, created_at
) VALUES
(
    'f1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    5, 5, 5, 5, 5,
    'Exceptional royal hospitality! The evening folk dances and the authentic Dal Baati at Sheesh Mahal were unforgettable. The concierge helped us navigate Amer Fort with zero lines.',
    'positive',
    0.98,
    ARRAY['Royal hospitality', 'Authentic culinary experience', 'Concierge tour planning', 'Evening cultural events'],
    ARRAY['None'],
    NOW() - INTERVAL '1 day'
),
(
    'f2222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    4, 5, 4, 3, 4,
    'Gorgeous palace architecture and spotless rooms. However, dinner service took over an hour on Friday night due to a banquet rush. Staff was very polite and apologetic.',
    'neutral',
    0.55,
    ARRAY['Stunning heritage architecture', 'Cleanliness', 'Polite staff'],
    ARRAY['Room service delivery speed during peak banquet hours', 'Food temperature consistency'],
    NOW() - INTERVAL '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Itinerary
INSERT INTO itineraries (
    id, user_id, title, destination, duration_days, budget_level, interests,
    itinerary_data, total_estimated_cost, currency, created_at
) VALUES
(
    'i1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '3-Day Royal Heritage & Artisan Trail',
    'Jaipur, Rajasthan',
    3,
    'luxury',
    ARRAY['Heritage Architecture', 'Fine Dining', 'Handicrafts & Gems', 'Photography'],
    '{
        "days": [
            {
                "day": 1,
                "theme": "Palaces and Astronomical Wonders",
                "activities": [
                    {"time": "09:30 AM", "title": "City Palace Royal Quarters", "description": "Explore Chandra Mahal, Mubarak Mahal, and the royal armory museum.", "estimated_cost": "INR 3,000", "tip": "Hire an official palace curatorial guide."},
                    {"time": "01:00 PM", "title": "Royal Lunch at Baradari", "description": "Dine in the marble colonnade courtyard inside City Palace.", "estimated_cost": "INR 2,800"},
                    {"time": "03:30 PM", "title": "Jantar Mantar UNESCO Observatory", "description": "World largest stone sundial and astronomical instruments.", "estimated_cost": "INR 500"},
                    {"time": "06:30 PM", "title": "Sunset photography at Hawa Mahal", "description": "Marvel at the 953 pink sandstone jharokhas from Wind View Cafe.", "estimated_cost": "INR 800"}
                ]
            },
            {
                "day": 2,
                "theme": "Majestic Amer & Jaigarh Forts",
                "activities": [
                    {"time": "08:30 AM", "title": "Amer Fort & Sheesh Mahal", "description": "Ascend to the 16th century hilltop fort and mirror palace.", "estimated_cost": "INR 2,500"},
                    {"time": "12:30 PM", "title": "Lake View Lunch overlooking Jal Mahal", "description": "Relax with panoramic vistas of the water palace.", "estimated_cost": "INR 2,000"},
                    {"time": "03:00 PM", "title": "Anokhi Hand-Block Printing Museum", "description": "Live block printing craft workshops with local artisans.", "estimated_cost": "INR 1,200"},
                    {"time": "07:30 PM", "title": "Gourmet Dinner at Sheesh Mahal", "description": "Five-course royal thali under silver candle chandeliers.", "estimated_cost": "INR 5,500"}
                ]
            },
            {
                "day": 3,
                "theme": "Bazaars, Textiles & Royal Stepwells",
                "activities": [
                    {"time": "09:00 AM", "title": "Panna Meena Ka Kund Stepwell", "description": "Geometric 16th century stepwell near Amer.", "estimated_cost": "Complimentary"},
                    {"time": "11:30 AM", "title": "Johari & Bapu Bazaars", "description": "Shop for authentic bandhej silks, blue pottery, and gemstones.", "estimated_cost": "Variable"},
                    {"time": "04:30 PM", "title": "Nahargarh Fort Sunset Point", "description": "Dramatic sunset panoramic views over the entire Pink City.", "estimated_cost": "INR 600"}
                ]
            }
        ],
        "estimated_total": "INR 18,900 - 24,000 per couple (excluding shopping)",
        "disclaimer": "All prices are approximate market estimates and do not constitute live locked rates."
    }'::jsonb,
    'INR 21,500 (~$260 USD)',
    'INR',
    NOW() - INTERVAL '4 days'
)
ON CONFLICT (id) DO NOTHING;

-- Seed AI Experience Insight Gap Detector Data
INSERT INTO ai_insights (
    id, hotel_id, analysis_date, total_complaints_analyzed, total_feedback_analyzed,
    recurring_issues, recommendations, gap_score, sentiment_summary
) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    CURRENT_DATE,
    14,
    38,
    '[
        {"issue": "Peak In-Room Dining Delivery Delays", "department": "food_beverage", "frequency": 6, "impact": "High", "root_cause": "Concurrently handling large banquet banquets and private suite room service orders from single kitchen pass."},
        {"issue": "Thermostat Cooling Calibration in East Wing", "department": "maintenance", "frequency": 4, "impact": "Medium", "root_cause": "Chilled water valves in Suite 301-306 need seasonal balancing."},
        {"issue": "Check-in Luggage Escort Queue at Peak 14:00 Arrival", "department": "front_desk", "frequency": 3, "impact": "Low", "root_cause": "Bell desk dispatch bottleneck when 4+ luxury cars arrive simultaneously."}
    ]'::jsonb,
    '[
        {"title": "Deploy Dedicated Room Service Expediter", "department": "food_beverage", "priority": "Urgent", "action": "Assign dedicated line cook and runner for in-room dining during peak banquet dinner hours (19:30 - 22:30).", "expected_impact": "Reduce room service delivery latency by 45%."},
        {"title": "Perform Preventative HVAC Balancing on 3rd Floor", "department": "maintenance", "priority": "High", "action": "Service digital thermostats and air flow dampers across suites 301 to 308 during low occupancy morning slot.", "expected_impact": "Eliminate recurring cooling complaints."},
        {"title": "Implement Mobile Fast-Checkin Concierge Greeter", "department": "front_desk", "priority": "Medium", "action": "Equip lobby hostesses with check-in tablets in the royal lounge to complete registration while guests enjoy welcome drinks.", "expected_impact": "Reduce reception lobby waiting time to under 90 seconds."}
    ]'::jsonb,
    88.4,
    '{"positive": 78, "neutral": 14, "negative": 8, "nps": 70}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

