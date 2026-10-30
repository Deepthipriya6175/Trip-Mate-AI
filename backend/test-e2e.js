import { SEED_USERS, SEED_HOTELS, SEED_FAQS } from './src/utils/seedData.js';
import { localStore } from './src/config/db.js';
import { hashPassword, comparePassword, signToken, verifyToken } from './src/utils/jwt.js';
import {
  chatConcierge,
  generateTravelItinerary,
  classifyComplaint,
  analyzeSentiment,
  detectExperienceGaps
} from './src/services/geminiService.js';
import { getHotelContext } from './src/services/hotelRetrievalService.js';
import { getGuestMemory } from './src/services/memoryService.js';

async function runE2ETests() {
  console.log('--- STARTING TRIPMATE AI END-TO-END VERIFICATION ---');

  // 1. Auth & Password Hashing Verification
  console.log('\n[1] Testing Auth & Security...');
  const testPw = 'luxuryPassword2026';
  const hashed = await hashPassword(testPw);
  const match = await comparePassword(testPw, hashed);
  console.log('✓ Password hashing and bcrypt compare:', match ? 'PASSED' : 'FAILED');

  const token = signToken({ id: 'test-123', email: 'test@tripmate.com', role: 'tourist' });
  const verified = verifyToken(token);
  console.log('✓ JWT signing and verification:', verified?.email === 'test@tripmate.com' ? 'PASSED' : 'FAILED');

  // 2. Verified Hotel Grounding Verification
  console.log('\n[2] Testing Verified Hotel Retrieval & FAQs...');
  const hotel = await getHotelContext('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  console.log('✓ Retrieved hotel:', hotel.name, `(${hotel.star_rating} Stars)`);
  console.log('✓ Verified FAQs count:', hotel.faqs.length);
  if (hotel.faqs.length === 0) throw new Error('FAQs missing');

  // 3. AI Concierge with Retrieval Grounding
  console.log('\n[3] Testing AI Concierge (Dining query)...');
  const chatReply = await chatConcierge({
    userMessage: 'What time is breakfast served at the bistro?',
    hotelContext: hotel,
    language: 'en'
  });
  console.log('✓ AI Concierge Reply:\n', chatReply.reply.substring(0, 150) + '...');

  // 4. AI Experience Memory (Recognizing active complaints)
  console.log('\n[4] Testing AI Experience Memory (Ticket status check)...');
  const memory = await getGuestMemory('11111111-1111-1111-1111-111111111111', hotel.id);
  console.log('✓ Guest Memory for Elena:', memory.guestName, '| Active Tickets:', memory.activeComplaints.length);
  
  const memoryChatReply = await chatConcierge({
    userMessage: 'Can you check the status of my AC repair issue?',
    hotelContext: hotel,
    userMemory: memory,
    language: 'en'
  });
  console.log('✓ Memory-informed Reply:\n', memoryChatReply.reply);

  // 5. Smart Complaint Classification
  console.log('\n[5] Testing Smart Complaint Classification...');
  const complaintClassification = await classifyComplaint({
    title: 'Water leaking from bathroom ceiling',
    description: 'There is a persistent water drip coming through the master bathroom ceiling tiles in suite 201.',
    roomNumber: '201'
  });
  console.log('✓ Classification Output:', {
    category: complaintClassification.category,
    urgency: complaintClassification.urgency,
    department: complaintClassification.department,
    confidence: complaintClassification.confidence
  });

  // 6. Travel Planner
  console.log('\n[6] Testing Personalized Travel Planner...');
  const itinerary = await generateTravelItinerary({
    destination: 'Jaipur, Rajasthan',
    durationDays: 3,
    budgetLevel: 'luxury',
    interests: ['Heritage', 'Royal Cuisine']
  });
  console.log('✓ Itinerary Title:', itinerary.title);
  console.log('✓ Days generated:', itinerary.days.length);
  console.log('✓ Estimated Total (Labeled):', itinerary.estimated_total_cost);

  // 7. Sentiment Analysis
  console.log('\n[7] Testing Review Sentiment Analysis...');
  const sentiment = await analyzeSentiment({
    comments: 'The palace grounds and royal evening concerts were magical! Staff was attentive, though check-in line took 15 mins.',
    ratings: { overall: 4, cleanliness: 5, staff: 5, food: 4 }
  });
  console.log('✓ Sentiment Output:', {
    sentiment: sentiment.sentiment,
    score: sentiment.sentiment_score,
    positives: sentiment.key_positives
  });

  // 8. Experience Gap Detector
  console.log('\n[8] Testing Experience Gap Detector...');
  const gaps = await detectExperienceGaps({
    complaints: localStore.getComplaints(),
    feedback: localStore.getFeedback(),
    hotelName: hotel.name
  });
  console.log('✓ Experience Gap Score:', gaps.gap_score);
  console.log('✓ Recurring Issues Identified:', gaps.recurring_issues.length);
  console.log('✓ Actionable Recommendations:', gaps.recommendations.length);

  console.log('\n--- ALL E2E VERIFICATIONS COMPLETED SUCCESSFULLY ---');
}

runE2ETests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

