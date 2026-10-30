import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env.js';

let genAI = null;

if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    console.log('[TripMate AI] Gemini API Client initialized with model:', ENV.GEMINI_MODEL);
  } catch (err) {
    console.warn('[TripMate AI] Failed to initialize Gemini API client:', err.message);
  }
} else {
  console.log('[TripMate AI] Gemini API Key not set. Running in resilient hybrid mode with built-in intelligent NLP engines.');
}

export const getGeminiModel = (modelName = ENV.GEMINI_MODEL) => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2, // low temperature for high precision & grounded responses
    }
  });
};

export const hasGeminiKey = () => !!genAI;

