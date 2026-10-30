# 🏨 TripMate AI – AI-Powered Customer Experience Platform for Hotels and Tourism

> An enterprise-grade, full-stack customer experience platform connecting tourists and luxury hotels with personalized AI assistance, multilingual communication, smart complaint management, and actionable operational insights.

---

## 🌟 Key Features & AI Capabilities

### 1. 🤖 AI Smart Hotel Concierge (Zero-Hallucination Grounding)
- Powered by **Google Gemini API** through the Node.js backend.
- Strictly grounded in verified hotel amenities, dining menus, check-in/out policies, and FAQs retrieved from **Supabase PostgreSQL**.
- If information is missing from verified records, the concierge explicitly notifies the guest and offers to connect them directly with Front Desk staff.

### 2. 🗺️ Personalized Travel Planner
- Curates structured, day-by-day itineraries based on destination, duration, budget tier (budget, moderate, luxury, ultra-luxury), and travel pace.
- **Transparency-First**: All expenses are clearly labeled as **"Estimated"**, never fabricating live locked rates or false ticket confirmations.
- Includes time schedules, insider tips, packing advice, and culinary pairings.

### 3. 🌐 Multilingual Assistant
- Seamless native-script communication in **English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Spanish (Español), and French (Français)**.
- Context and language preferences persist across guest sessions.

### 4. 🚨 Smart Complaint Classification & Ticket Dispatch
- AI analyzes incoming guest complaints to automatically classify:
  - **Category**: Housekeeping, Maintenance, Food & Beverage, Billing, Booking, Noise, Amenities, General Service.
  - **Urgency**: Low, Medium, High, Critical.
  - **Department Dispatch**: Dispatched to the appropriate hotel team (Engineering, Housekeeping, Front Desk, F&B, Cashier).
- Real-time classification preview provided to the guest as they type.

### 5. 💖 Sentiment Analysis & Multivariable Feedback
- Analyzes review text to evaluate sentiment (`positive`, `neutral`, `negative`), sentiment score, key highlighted strengths, and operational improvement areas.
- Evaluates individual ratings across Overall, Cleanliness, Staff, Food, and Amenities.

### 6. 🧠 AI Experience Memory
- Automatically queries the authenticated guest's active, unresolved complaints before responding in the Concierge chat.
- Inquiring about an ongoing issue (e.g. AC service or dining delay) retrieves the **actual live ticket status and technician notes**, eliminating duplicate tickets.

### 7. 📈 Experience Gap Detector
- Aggregates real logged tickets, turnaround latencies, and guest reviews.
- Pinpoints root cause operational bottlenecks and generates prioritized, high-ROI managerial recommendations for hotel leadership.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    A[React 18 + Vite Frontend<br/>Tailwind CSS + Recharts] -->|REST API + JWT Bearer| B[Node.js + Express Backend<br/>Zod + Helmet + Rate Limiter]
    B -->|Verified Hotel Data & RLS| C[Supabase PostgreSQL<br/>11 Tables + RLS Policies]
    B -->|Grounded Structured Prompts| D[Google Gemini 1.5 Flash<br/>@google/generative-ai]
```

- **Frontend**: React 18, Vite, React Router DOM (v6), Tailwind CSS (Warm Ivory & Deep Teal Luxury Identity), Recharts, Lucide React, Axios.
- **Backend**: Node.js (ES Modules), Express.js, JWT, bcryptjs, Zod validation, Helmet security headers, Express Rate Limiter, Morgan logger.
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`), Row-Level Security (RLS) policies, full schema with verified seed data in `supabase_setup.sql`.
- **AI**: Google Gemini API via Node.js backend. Fallback hybrid intelligence engine for resilient offline evaluation.

---

## 👥 User Roles & Personas

| Role | Default Demo Account | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Tourist** | `tourist@tripmate.com` | `password123` | Register/login, AI Concierge chat, travel planner, log complaints, track ticket status, give stay feedback. |
| **Hotel Staff** | `staff@tripmate.com` | `password123` | View assigned hotel complaints, update ticket status (`pending` → `in_progress` → `resolved`), log staff resolution notes. |
| **Admin GM** | `admin@tripmate.com` | `password123` | Executive analytics, department breakdown charts, sentiment ratios, AI Experience Gap Detector recommendations. |

> 💡 **Quick 1-Click Evaluation**: On the login page, use the **"Instant Demo Evaluation"** buttons to immediately log in as Elena Rostova (Tourist), Vikramaditya Rathore (Staff), or Devendra Singh (Admin).

---

## 📁 Repository Structure

```text
TripMate-AI/
├── frontend/
│   ├── src/
│   │   ├── components/      # Badges, Modal, Navbar, Footer, LanguageSelector
│   │   ├── context/         # AuthContext (JWT, user state, demo login)
│   │   ├── layouts/         # RootLayout (Navbar + Outlet + Footer)
│   │   ├── pages/           # 11 Full-Featured Responsive Pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── TouristDashboard.jsx
│   │   │   ├── ConciergeChatPage.jsx
│   │   │   ├── TravelPlannerPage.jsx
│   │   │   ├── ComplaintsPage.jsx
│   │   │   ├── FeedbackPage.jsx
│   │   │   ├── StaffDashboard.jsx
│   │   │   ├── ComplaintManagementPage.jsx
│   │   │   ├── AdminAnalyticsDashboard.jsx
│   │   │   └── ProfileSettingsPage.jsx
│   │   ├── services/        # Axios API Client with JWT interceptors
│   │   ├── App.jsx          # Protected route configurations
│   │   ├── main.jsx         # Vite entry
│   │   └── index.css        # Tailwind styling & hospitality typography
│   ├── .env.example
│   ├── .env
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Gemini, Env configurations
│   │   ├── controllers/     # Auth, AI, Complaints, Feedback, Hotels, Analytics
│   │   ├── middleware/      # Auth JWT, Role enforcement, Rate limiting, Validation
│   │   ├── routes/          # Express API route modules
│   │   ├── services/        # Gemini AI, Hotel Retrieval, Memory services
│   │   ├── utils/           # JWT & verified seed dataset
│   │   ├── validators/      # Zod validation schemas
│   │   └── index.js         # Express server entry point
│   ├── .env.example
│   ├── .env
│   └── package.json
├── supabase/
│   ├── migrations/          # SQL migrations
│   └── seed.sql             # Demo seed data
├── supabase_setup.sql       # Complete idempotent PostgreSQL schema & RLS setup
├── .gitignore
└── README.md
```

---

## 🚀 Local Installation & Setup Guide

### 1. Prerequisites
- **Node.js** v18 or later (`node -v`)
- **npm** v9 or later (`npm -v`)
- *(Optional for live remote services)*: A free Supabase account and Google AI Studio Gemini API Key.

---

### 2. Configure Environment Variables

#### Backend Configuration (`backend/.env`):
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=tripmate_super_secret_jwt_key_2026_dev_secure
JWT_EXPIRES_IN=7d

# Google Gemini API Key (Get free key from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Supabase Credentials (Optional for local hybrid mode, required for live Supabase)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration (`frontend/.env`):
Create `frontend/.env` (or copy from `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TripMate AI
```

---

### 3. Database Setup (Supabase PostgreSQL)

1. Open your [Supabase Dashboard](https://database.new) and create a new project.
2. Navigate to the **SQL Editor** tab.
3. Open the file `supabase_setup.sql` in the root of this repository.
4. Copy its contents, paste into the Supabase SQL Editor, and click **Run**.
5. This creates all 11 tables (`profiles`, `hotels`, `hotel_staff`, `hotel_faqs`, `conversations`, `messages`, `complaints`, `feedback`, `travel_preferences`, `itineraries`, `ai_insights`), enables Row Level Security (RLS), adds performance indexes, and seeds verified sample data for **"The Grand Heritage Palace & Royal Resort, Jaipur"**.
6. Copy your **Project URL** and **anon / service_role API keys** into `backend/.env`.

> 💡 **Out-of-the-Box Mode**: If Supabase credentials are not provided initially, TripMate AI automatically boots in a resilient hybrid store mode pre-loaded with identical verified hotel data, allowing full instant testing without any external setup block!

---

### 4. Running the Application Locally

#### Terminal 1: Start Backend API
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

#### Terminal 2: Start Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` – Register a new tourist or hotel staff account.
- `POST /api/auth/login` – Authenticate with email and password to receive JWT.
- `POST /api/auth/demo-login` – 1-click login for `tourist`, `hotel_staff`, or `admin`.
- `GET /api/auth/me` – Retrieve active authenticated session profile.

### AI Engine (Google Gemini Grounded)
- `POST /api/ai/chat` – AI Concierge chat with verified hotel grounding & experience memory.
- `POST /api/ai/itinerary` – Curate structured personalized day-by-day travel plan.
- `POST /api/ai/classify-complaint` – Real-time complaint triage (category, urgency, department).
- `POST /api/ai/analyze-sentiment` – Review sentiment scoring and highlight extraction.
- `GET /api/ai/gap-analysis` – Experience Gap Detector identifying recurring bottlenecks.

### Complaints & Operations
- `POST /api/complaints` – Submit new guest ticket (auto-classified by AI).
- `GET /api/complaints` – List tickets (Tourists see own; Staff sees hotel; Admin sees all).
- `GET /api/complaints/:id` – View full ticket details and status.
- `PATCH /api/complaints/:id` – Update ticket status and staff resolution notes.

### Feedback & Reviews
- `POST /api/feedback` – Submit star ratings and review comments (sentiment-analyzed).
- `GET /api/feedback` – Read verified public hotel reviews.

### Hotels & Analytics
- `GET /api/hotels` – List verified hotel properties.
- `GET /api/hotels/:id` – Retrieve hotel details, policies, dining, and facilities.
- `GET /api/hotels/:id/faqs` – Retrieve verified knowledge base FAQs.
- `GET /api/analytics` – Retrieve real database metrics and charts for executive dashboard.

---

## 🚢 Deployment Guide

### Deploy Frontend to Vercel
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), import your repository and select the **`frontend`** directory as the Root Directory.
3. Configure Build Settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://tripmate-backend.onrender.com/api`)
5. Deploy!

### Deploy Backend to Render or Railway
1. In [Render](https://render.com) or [Railway](https://railway.app), create a new Web Service and select the **`backend`** directory.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: XYZLQ5pX/GX6luR367PLL60Li8D9A4rt1I7//YTeI4w6B7kncvJcOQBYcpiTcqUXYqLg4R2wOaItMb0pX3PdQQ==
   - `GEMINI_API_KEY`:AQAb8RN6K0br3oDcboJ1wEpcZ1qGQ-ppDO9MP4t_XJD608Sq9XDw
   - `SUPABASE_URL`:  https://vlqhwruaprehcssuwxqn.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscWh3cnVhcHJlaGNzc3V3eHFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzMzNTcxNCwiZXhwIjoyMTA4OTExNzE0fQ.spCERiP7HDP_v5D3kXWgqvgHaIFXg7ifbzohlU4wIuU

   - `CLIENT_URL`: Your Vercel frontend URL
5. Deploy!

---

## 🛡️ Security & Privacy
- **No Secret Key Exposure**: Google Gemini API keys and Supabase service role secrets are strictly kept on the Node.js backend.
- **Row Level Security (RLS)**: Enforced directly at the PostgreSQL layer in Supabase. Tourists cannot access other guests' private tickets or profiles.
- **Input Validation**: All incoming requests are validated against strict Zod schemas.
- **Rate Limiting**: AI and Auth endpoints are protected with Express Rate Limiter.

