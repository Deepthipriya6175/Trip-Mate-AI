// Verified seed data matching supabase_setup.sql for local hybrid mode and DB seeding
export const SEED_USERS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'tourist@tripmate.com',
    password_hash: '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', // password123
    full_name: 'Elena Rostova',
    role: 'tourist',
    preferred_language: 'en',
    phone: '+1 555-0192',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'staff@tripmate.com',
    password_hash: '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', // password123
    full_name: 'Vikramaditya Rathore',
    role: 'hotel_staff',
    preferred_language: 'en',
    phone: '+91 98765-43210',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    department: 'front_desk',
    role_title: 'Senior Guest Experience Manager',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'admin@tripmate.com',
    password_hash: '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H', // password123
    full_name: 'Devendra Singh',
    role: 'admin',
    preferred_language: 'en',
    phone: '+91 98765-00000',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'priya.sharma@example.com',
    password_hash: '$2a$10$gXqA0tQ29tM5B4eM7/dYq.v5gI9E8N0xV1Y2Z3A4B5C6D7E8F9G0H',
    full_name: 'Priya Sharma',
    role: 'tourist',
    preferred_language: 'hi',
    phone: '+91 98231-11223',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  }
];

export const SEED_HOTELS = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'The Grand Heritage Palace & Royal Resort',
    slug: 'grand-heritage-palace',
    description: 'A magnificent 5-star royal heritage sanctuary blending 18th-century Rajputana architecture with bespoke contemporary luxury. Located amidst 15 acres of landscaped Mughal gardens with private plunge pools, holistic Ayurvedic wellness sanctuaries, and authentic royal fine dining.',
    address: 'Heritage Hills, Amer Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    star_rating: 4.9,
    check_in_time: '14:00',
    check_out_time: '11:00',
    contact_email: 'concierge@grandheritagepalace.com',
    contact_phone: '+91 141 289 9000',
    amenities: [
      'Complimentary High-Speed Wi-Fi 6',
      'Temperature-Controlled Infinity Pool',
      'Jiva Royal Ayurvedic Spa',
      '24/7 Butler Service',
      'Complimentary Airport Chauffeur',
      'Kids Activity Sanctuary',
      'Helipad & Valet Parking',
      'Fitness Pavilion & Yoga Lawn'
    ],
    policies: [
      { title: 'Check-in & Check-out', detail: 'Guaranteed check-in from 14:00 hrs. Check-out is until 11:00 hrs. Early check-in and late check-out available subject to prior reservation and availability.' },
      { title: 'Cancellation Policy', detail: 'Free cancellation up to 48 hours prior to arrival date. 1 night charge applies within 48 hours.' },
      { title: 'Child Policy', detail: 'Children up to 6 years stay complimentary sharing existing bedding. Cribs available upon advance request at no additional charge.' },
      { title: 'Pet Policy', detail: 'Designated pet-friendly royal suites available with a daily sanitization fee of INR 2,500. Pets must be leashed in public gardens.' },
      { title: 'Smoking Policy', detail: 'All indoor guest rooms, heritage hallways, and suites are 100% non-smoking. Dedicated open-air terrace pavilions are designated for smoking.' }
    ],
    dining_info: [
      { name: 'Sheesh Mahal Fine Dine', cuisine: 'Royal Rajasthani & North Indian Gourmet', hours: '19:00 - 23:30', dress_code: 'Smart Casual', specialty: 'Dal Baati Churma, Laal Maas, Ker Sangri' },
      { name: 'The Courtyard Bistro', cuisine: 'All-day Continental, Mediterranean & Artisan Bakery', hours: '06:30 - 23:00', dress_code: 'Casual', specialty: 'Woodfired Truffle Flatbread, Sourdough Breakfast' },
      { name: 'Mughal Lounge & High Tea', cuisine: 'Artisanal Teas, Mocktails, Single Estate Coffees', hours: '10:00 - 22:00', dress_code: 'Casual', specialty: 'Masala Chai High Tea Tower' }
    ],
    facilities_info: [
      { facility: 'Ayurvedic Spa & Wellness', timings: '07:00 - 21:00', booking: 'Appointments recommended 2 hours in advance via concierge' },
      { facility: 'Infinity Pool & Sun Terrace', timings: '06:00 - 20:00', rules: 'Proper swimwear required; lifeguard on duty' },
      { facility: 'Business Centre & Conference Hall', timings: '24 Hours', amenities: 'High-speed AV, video conferencing, secretarial assistance' },
      { facility: 'Heritage Walk & Cultural Folk Dance', timings: 'Every evening at 18:30 in the Central Fountain Courtyard', fee: 'Complimentary for resident guests' }
    ],
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Azure Coastal Resort & Spa',
    slug: 'azure-coastal-resort',
    description: 'A serene beachfront luxury haven overlooking the azure waters of the Arabian Sea. Offering sea-facing villas, private beach access, scuba diving excursions, and fresh organic seafood dining under the stars.',
    address: 'Candolim Beach Road, North Goa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    star_rating: 4.7,
    check_in_time: '15:00',
    check_out_time: '11:00',
    contact_email: 'stay@azureresortgoa.com',
    contact_phone: '+91 832 249 7100',
    amenities: [
      'Private Beach Front',
      'Sea-view Infinity Pool',
      'Water Sports Center',
      'Sunset Deck Bar',
      'Seafood Grill',
      'Free Breakfast Buffet',
      'Bicycle Rentals',
      'High-Speed Wi-Fi'
    ],
    policies: [
      { title: 'Check-in Policy', detail: 'Standard check-in is 15:00. Government-issued photo ID required for all staying guests.' },
      { title: 'Pool & Beach Guidelines', detail: 'Private beach gate is accessible from 06:00 to 22:00. Beach towels provided at pool desk.' }
    ],
    dining_info: [
      { name: 'Wave Crest Seafood Grill', cuisine: 'Goan, Portuguese & Mediterranean Seafood', hours: '12:30 - 23:00', specialty: 'Butter Garlic Lobster, Prawn Balchão' },
      { name: 'Breeze Pool Bar', cuisine: 'Tropical Cocktails & Tapas', hours: '11:00 - 23:00', specialty: 'Coconut Mojito, Tapas Platter' }
    ],
    facilities_info: [
      { facility: 'Water Sports & Scuba Desk', timings: '08:00 - 17:00', booking: 'Book at Front Desk prior to 10:00 AM' },
      { facility: 'Wellness Pavilion', timings: '07:00 - 20:00', amenities: 'Steam, sauna, beachfront yoga' }
    ],
    image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80'
  }
];

export const SEED_FAQS = [
  {
    id: 'faq-1',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Check-In & Out',
    question: 'What are the check-in and check-out times?',
    answer: 'Our check-in time starts at 14:00 (2:00 PM), and check-out is by 11:00 AM. Early check-in or late check-out is subject to room availability upon arrival or can be arranged through the front desk.',
    keywords: ['checkin', 'checkout', 'times', 'early', 'late'],
    is_active: true
  },
  {
    id: 'faq-2',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Wi-Fi & Internet',
    question: 'How do I connect to the complimentary Wi-Fi?',
    answer: 'Connect to the network named "GrandHeritage_Guest". Select "Connect", enter your room number and last name. High-speed 100 Mbps fiber internet is completely complimentary throughout the property.',
    keywords: ['wifi', 'internet', 'password', 'connection', 'network'],
    is_active: true
  },
  {
    id: 'faq-3',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Dining & Breakfast',
    question: 'When and where is breakfast served?',
    answer: 'Complimentary royal breakfast buffet is served daily at The Courtyard Bistro on the Ground Floor from 06:30 AM to 10:30 AM. In-room dining breakfast can also be ordered 24/7 using your room intercom (dial 4).',
    keywords: ['breakfast', 'timing', 'bistro', 'food', 'morning'],
    is_active: true
  },
  {
    id: 'faq-4',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Dining & Breakfast',
    question: 'Are vegetarian, vegan, and Jain food options available?',
    answer: 'Yes! Sheesh Mahal and The Courtyard Bistro offer extensive pure vegetarian, vegan, and dedicated Jain culinary preparations curated by our Master Chefs with separate preparation kitchens.',
    keywords: ['vegetarian', 'vegan', 'jain', 'halal', 'dietary'],
    is_active: true
  },
  {
    id: 'faq-5',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Spa & Wellness',
    question: 'What are the spa timings and how can I book a treatment?',
    answer: 'The Jiva Royal Ayurvedic Spa is open daily from 07:00 AM to 09:00 PM. We recommend booking at least 2 hours in advance by dialing 8 from your room phone or visiting the Concierge Desk.',
    keywords: ['spa', 'massage', 'ayurveda', 'wellness', 'booking'],
    is_active: true
  },
  {
    id: 'faq-6',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Transportation',
    question: 'Do you provide airport pick-up and drop transfers?',
    answer: 'Yes, we provide luxury chauffeur-driven airport transfers to and from Jaipur International Airport (JAI), located approximately 28 km (45 mins) away. Please notify the Concierge desk at least 4 hours before your flight.',
    keywords: ['airport', 'shuttle', 'cab', 'transfer', 'chauffeur', 'pickup'],
    is_active: true
  },
  {
    id: 'faq-7',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Swimming Pool',
    question: 'What are the pool hours and regulations?',
    answer: 'The temperature-controlled infinity pool is open from 06:00 AM to 08:00 PM. Complimentary towels, sun loungers, and poolside refreshments are provided. Proper swimwear is required.',
    keywords: ['pool', 'swimming', 'hours', 'towel'],
    is_active: true
  },
  {
    id: 'faq-8',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Sightseeing & Attractions',
    question: 'What attractions are nearby and can you book local tours?',
    answer: 'We are conveniently located near Amer Fort (6 km, 15 mins), Jal Mahal (4 km, 10 mins), City Palace (9 km, 20 mins), and Hawa Mahal (8.5 km). Our Concierge can arrange private heritage guides, vintage car excursions, and skip-the-line fort tickets.',
    keywords: ['sightseeing', 'amer fort', 'jal mahal', 'tour', 'city palace', 'attractions'],
    is_active: true
  },
  {
    id: 'faq-9',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Room Service & Housekeeping',
    question: 'How do I request extra towels, drinking water, or room cleaning?',
    answer: 'Housekeeping is available 24/7. Simply press the "Housekeeping" button on your room phone or dial 3. Extra organic cotton towels, feather pillows, and packaged Himalayan spring water are provided promptly at no extra charge.',
    keywords: ['housekeeping', 'towels', 'water', 'cleaning', 'pillows'],
    is_active: true
  },
  {
    id: 'faq-10',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category: 'Emergency & Medical',
    question: 'Is there medical assistance available on site?',
    answer: 'A certified first-aid doctor is on call 24 hours a day, and an emergency medical kit and oxygen concentrator are maintained at the front desk. In case of any emergency, please dial 0 immediately.',
    keywords: ['doctor', 'medical', 'emergency', 'medicine', 'hospital'],
    is_active: true
  }
];

export const SEED_COMPLAINTS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    user_id: '11111111-1111-1111-1111-111111111111',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    room_number: '304',
    title: 'Air conditioning cooling is weak in bedroom',
    description: 'The temperature inside Master Suite 304 stays around 26°C despite setting the thermostat to 20°C. There is a slight humming noise from the duct.',
    category: 'maintenance',
    urgency: 'high',
    department: 'maintenance',
    status: 'in_progress',
    ai_confidence: 0.96,
    resolution_notes: 'Maintenance engineer Rajesh dispatched at 10:15 AM to inspect compressor filter and refrigerant levels.',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    guest_name: 'Elena Rostova',
    guest_email: 'tourist@tripmate.com'
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    user_id: '44444444-4444-4444-4444-444444444444',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    room_number: '112',
    title: 'Delay in room service dinner delivery',
    description: 'Ordered dinner at 8:15 PM, was informed 30 minutes ETA. Food arrived after 65 minutes and soup was lukewarm.',
    category: 'food_beverage',
    urgency: 'medium',
    department: 'food_beverage',
    status: 'resolved',
    ai_confidence: 0.92,
    resolution_notes: 'Offered complimentary dessert and 20% discount on in-room dining bill. Guest expressed satisfaction with prompt apology.',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    guest_name: 'Priya Sharma',
    guest_email: 'priya.sharma@example.com'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    user_id: '11111111-1111-1111-1111-111111111111',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    room_number: '304',
    title: 'Need extra hypoallergenic pillows and bath sheets',
    description: 'Please send two additional hypoallergenic pillows and two bath sheets to room 304 before 6 PM.',
    category: 'housekeeping',
    urgency: 'low',
    department: 'housekeeping',
    status: 'resolved',
    ai_confidence: 0.98,
    resolution_notes: 'Delivered freshly laundered hypoallergenic microfiber pillows and bath sheets at 4:30 PM.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000 + 7200000).toISOString(),
    resolved_at: new Date(Date.now() - 3 * 86400000 + 7200000).toISOString(),
    guest_name: 'Elena Rostova',
    guest_email: 'tourist@tripmate.com'
  }
];

export const SEED_FEEDBACK = [
  {
    id: 'f1111111-1111-1111-1111-111111111111',
    user_id: '11111111-1111-1111-1111-111111111111',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    rating_overall: 5,
    rating_cleanliness: 5,
    rating_staff: 5,
    rating_food: 5,
    rating_amenities: 5,
    comments: 'Exceptional royal hospitality! The evening folk dances and the authentic Dal Baati at Sheesh Mahal were unforgettable. The concierge helped us navigate Amer Fort with zero lines.',
    sentiment: 'positive',
    sentiment_score: 0.98,
    key_positives: ['Royal hospitality', 'Authentic culinary experience', 'Concierge tour planning', 'Evening cultural events'],
    key_improvements: ['None'],
    guest_name: 'Elena Rostova',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    user_id: '44444444-4444-4444-4444-444444444444',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    rating_overall: 4,
    rating_cleanliness: 5,
    rating_staff: 4,
    rating_food: 3,
    rating_amenities: 4,
    comments: 'Gorgeous palace architecture and spotless rooms. However, dinner service took over an hour on Friday night due to a banquet rush. Staff was very polite and apologetic.',
    sentiment: 'neutral',
    sentiment_score: 0.55,
    key_positives: ['Stunning heritage architecture', 'Cleanliness', 'Polite staff'],
    key_improvements: ['Room service delivery speed during peak banquet hours', 'Food temperature consistency'],
    guest_name: 'Priya Sharma',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const SEED_ITINERARIES = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    user_id: '11111111-1111-1111-1111-111111111111',
    title: '3-Day Royal Heritage & Artisan Trail',
    destination: 'Jaipur, Rajasthan',
    duration_days: 3,
    budget_level: 'luxury',
    interests: ['Heritage Architecture', 'Fine Dining', 'Handicrafts & Gems', 'Photography'],
    itinerary_data: {
      days: [
        {
          day: 1,
          theme: 'Palaces and Astronomical Wonders',
          activities: [
            { time: '09:30 AM', title: 'City Palace Royal Quarters', description: 'Explore Chandra Mahal, Mubarak Mahal, and the royal armory museum.', estimated_cost: 'INR 3,000', tip: 'Hire an official palace curatorial guide.' },
            { time: '01:00 PM', title: 'Royal Lunch at Baradari', description: 'Dine in the marble colonnade courtyard inside City Palace.', estimated_cost: 'INR 2,800' },
            { time: '03:30 PM', title: 'Jantar Mantar UNESCO Observatory', description: 'World largest stone sundial and astronomical instruments.', estimated_cost: 'INR 500' },
            { time: '06:30 PM', title: 'Sunset photography at Hawa Mahal', description: 'Marvel at the 953 pink sandstone jharokhas from Wind View Cafe.', estimated_cost: 'INR 800' }
          ]
        },
        {
          day: 2,
          theme: 'Majestic Amer & Jaigarh Forts',
          activities: [
            { time: '08:30 AM', title: 'Amer Fort & Sheesh Mahal', description: 'Ascend to the 16th century hilltop fort and mirror palace.', estimated_cost: 'INR 2,500' },
            { time: '12:30 PM', title: 'Lake View Lunch overlooking Jal Mahal', description: 'Relax with panoramic vistas of the water palace.', estimated_cost: 'INR 2,000' },
            { time: '03:00 PM', title: 'Anokhi Hand-Block Printing Museum', description: 'Live block printing craft workshops with local artisans.', estimated_cost: 'INR 1,200' },
            { time: '07:30 PM', title: 'Gourmet Dinner at Sheesh Mahal', description: 'Five-course royal thali under silver candle chandeliers.', estimated_cost: 'INR 5,500' }
          ]
        },
        {
          day: 3,
          theme: 'Bazaars, Textiles & Royal Stepwells',
          activities: [
            { time: '09:00 AM', title: 'Panna Meena Ka Kund Stepwell', description: 'Geometric 16th century stepwell near Amer.', estimated_cost: 'Complimentary' },
            { time: '11:30 AM', title: 'Johari & Bapu Bazaars', description: 'Shop for authentic bandhej silks, blue pottery, and gemstones.', estimated_cost: 'Variable' },
            { time: '04:30 PM', title: 'Nahargarh Fort Sunset Point', description: 'Dramatic sunset panoramic views over the entire Pink City.', estimated_cost: 'INR 600' }
          ]
        }
      ],
      estimated_total: 'INR 18,900 - 24,000 per couple (excluding shopping)',
      disclaimer: 'All prices are approximate market estimates and do not constitute live locked rates.'
    },
    total_estimated_cost: 'INR 21,500 (~$260 USD)',
    currency: 'INR',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

export const SEED_AI_INSIGHTS = {
  id: 'a1111111-1111-1111-1111-111111111111',
  hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  analysis_date: new Date().toISOString().split('T')[0],
  total_complaints_analyzed: 14,
  total_feedback_analyzed: 38,
  recurring_issues: [
    { issue: 'Peak In-Room Dining Delivery Delays', department: 'food_beverage', frequency: 6, impact: 'High', root_cause: 'Concurrently handling large banquet banquets and private suite room service orders from single kitchen pass.' },
    { issue: 'Thermostat Cooling Calibration in East Wing', department: 'maintenance', frequency: 4, impact: 'Medium', root_cause: 'Chilled water valves in Suite 301-306 need seasonal balancing.' },
    { issue: 'Check-in Luggage Escort Queue at Peak 14:00 Arrival', department: 'front_desk', frequency: 3, impact: 'Low', root_cause: 'Bell desk dispatch bottleneck when 4+ luxury cars arrive simultaneously.' }
  ],
  recommendations: [
    { title: 'Deploy Dedicated Room Service Expediter', department: 'food_beverage', priority: 'Urgent', action: 'Assign dedicated line cook and runner for in-room dining during peak banquet dinner hours (19:30 - 22:30).', expected_impact: 'Reduce room service delivery latency by 45%.' },
    { title: 'Perform Preventative HVAC Balancing on 3rd Floor', department: 'maintenance', priority: 'High', action: 'Service digital thermostats and air flow dampers across suites 301 to 308 during low occupancy morning slot.', expected_impact: 'Eliminate recurring cooling complaints.' },
    { title: 'Implement Mobile Fast-Checkin Concierge Greeter', department: 'front_desk', priority: 'Medium', action: 'Equip lobby hostesses with check-in tablets in the royal lounge to complete registration while guests enjoy welcome drinks.', expected_impact: 'Reduce reception lobby waiting time to under 90 seconds.' }
  ],
  gap_score: 88.4,
  sentiment_summary: { positive: 78, neutral: 14, negative: 8, nps: 70 }
};

