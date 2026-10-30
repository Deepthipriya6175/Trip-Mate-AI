# 🚢 Complete Production Deployment Guide

This guide covers deploying the **TripMate AI** platform:
- **Backend API** ➔ [Render](https://render.com) (Node.js Web Service)
- **Frontend App** ➔ [Vercel](https://vercel.com) (Vite React SPA)
- **Database** ➔ [Supabase](https://supabase.com) (Managed PostgreSQL with Row Level Security)

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
1. A GitHub repository containing your code.
2. A free [Supabase](https://supabase.com) account.
3. A free [Render](https://render.com) account.
4. A free [Vercel](https://vercel.com) account.
5. A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

---

## 🗄️ Step 1: Database Setup on Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Name your project (e.g. `tripmate-ai`), set a secure database password, and select your region.
3. Once the database is ready, go to the **SQL Editor** tab on the left menu.
4. Open the file `supabase_setup.sql` from your project root, copy the entire SQL script, paste it into the SQL Editor, and click **Run**.
   - *This creates all 11 tables (`profiles`, `hotels`, `hotel_staff`, `hotel_faqs`, `complaints`, `feedback`, `itineraries`, `ai_insights`, etc.), configures Row Level Security (RLS) policies, and seeds verified hotel data.*
5. Navigate to **Project Settings > API**:
   - Copy the **Project URL** (e.g. `https://xxxx.supabase.co`).
   - Copy the **anon public key** (`anon` `public`).
   - Copy the **service_role key** (`service_role` `secret` — *keep this private!*).

---

## ⚙️ Step 2: Deploy Backend to Render

### Option A: Using the Render Blueprint (`render.yaml` - Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New + > Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` and configure:
   - **Service Name**: `tripmate-ai-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Fill in the prompted secret environment variables:
   - `GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio.
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase anon public key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key.
   - `CLIENT_URL`: Leave empty initially, or set to your Vercel URL once deployed.
6. Click **Apply**. Render will build and deploy your backend service.
7. Once deployed, note down your Render Web Service URL (e.g., `https://tripmate-backend.onrender.com`).

### Option B: Manual Web Service Setup on Render
1. Click **New + > Web Service**.
2. Select your repository.
3. Configure the settings:
   - **Name**: `tripmate-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your Supabase region
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `JWT_SECRET` | *(Generate a 32+ character random string)* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `GEMINI_API_KEY` | `your_google_gemini_api_key` |
   | `GEMINI_MODEL` | `gemini-1.5-flash` |
   | `SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `SUPABASE_ANON_KEY` | `your_supabase_anon_key` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key` |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` *(update after step 3)* |
5. Click **Create Web Service**.

Verify the backend deployment by visiting:
```
https://<your-render-app>.onrender.com/api/health
```
You should see: `{"status":"healthy","timestamp":"...","service":"TripMate AI Backend API"}`

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Import your GitHub repository.
3. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select **`frontend`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` | Your Render backend URL with `/api` |
   | `VITE_APP_NAME` | `TripMate AI` | Application branding |
5. Click **Deploy**.
6. Vercel will build the frontend and provide your production URL (e.g., `https://tripmate-ai.vercel.app`).
   - *Note: `frontend/vercel.json` is already configured with rewrite rules so page refreshes on subroutes like `/concierge`, `/planner`, and `/staff/dashboard` will never 404!*

---

## 🔄 Step 4: Final Linkage (CORS)

1. Copy your Vercel production URL (e.g., `https://tripmate-ai.vercel.app`).
2. Go back to your [Render Dashboard](https://dashboard.render.com).
3. Open your `tripmate-backend` service > **Environment**.
4. Set `CLIENT_URL` to your Vercel URL (e.g. `https://tripmate-ai.vercel.app`).
5. Save changes. Render will automatically redeploy with the updated CORS configuration.

---

## ✅ Step 5: Post-Deployment Smoke Test

Visit your live Vercel URL:
1. **Landing Page**: Check that hero and links load cleanly.
2. **Instant Demo Login**: Click **Sign In** and click **Tourist Guest (Elena)** or **Hotel Staff (Vikramaditya)** to confirm JWT authentication works.
3. **AI Concierge**: Open `/concierge` and ask *"When is breakfast served?"* to verify Supabase FAQ retrieval and Gemini response generation.
4. **Ticket Triage**: Submit a test complaint under `/complaints` to confirm real-time AI classification and database persistence.
5. **Analytics**: Visit `/admin/analytics` to verify Recharts visualizations and the Experience Gap Detector.

