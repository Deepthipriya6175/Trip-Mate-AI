import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MessageSquare,
  MapPin,
  Sparkles,
  ShieldCheck,
  Languages,
  Clock,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Building2,
  TrendingUp
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="bg-ivory-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-ivory-200">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                <span>Next-Generation AI for Luxury Hospitality</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-950 tracking-tight leading-[1.15]">
                Elevate Every Stay with <span className="text-teal-700 italic">Intelligent</span> Hospitality.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-light leading-relaxed">
                Connect tourists and hotels with personalized AI concierges grounded in verified hotel knowledge, automated multilingual communication, smart issue resolution, and real-time customer experience gap analytics.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/concierge"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 shadow-md transition-all group"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-royal-gold" />
                  Try AI Concierge Live
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/planner"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-teal-900 bg-ivory-200 hover:bg-ivory-300 border border-ivory-300 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2 text-teal-700" />
                  Plan Custom Itinerary
                </Link>
              </div>

              {/* Verification Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-ivory-200 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Zero Hallucinations (Grounded)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Languages className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Multilingual Support</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-royal-gold flex-shrink-0" />
                  <span>Supabase RLS Secured</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white p-6 shadow-elevated border border-ivory-300">
                <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-800 text-royal-gold flex items-center justify-center font-serif text-lg font-bold">
                      GH
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-teal-950">Grand Heritage Palace</h4>
                      <p className="text-[11px] text-emerald-700 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                        AI Concierge Active • Verified Hotel Data
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-royal-sand text-teal-900 px-2 py-0.5 rounded-full font-semibold">
                    5-Star Luxury
                  </span>
                </div>

                {/* Simulated Chat Dialogue */}
                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-end">
                    <div className="bg-teal-700 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[85%] shadow-sm">
                      When does the Sheesh Mahal restaurant open, and can you check on my AC service ticket?
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                      AI
                    </div>
                    <div className="bg-ivory-100 text-slate-800 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[88%] border border-ivory-200 shadow-sm leading-relaxed">
                      <p className="font-semibold text-teal-900 mb-1">Good evening Elena,</p>
                      <p className="mb-2">
                        • <strong>Sheesh Mahal Fine Dine</strong> opens tonight from <strong>19:00 to 23:30</strong> (Smart Casual dress code). Specialty: Royal Dal Baati Churma.
                      </p>
                      <p className="pt-1.5 border-t border-ivory-200 text-teal-800">
                        🔔 <strong>Ticket #c1111111 (Suite 304 AC)</strong>: Status is <strong>IN PROGRESS</strong>. Engineer Rajesh was dispatched at 10:15 AM to inspect compressor filter.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center text-teal-700 font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Response time: ~420ms
                  </span>
                  <Link to="/concierge" className="text-teal-700 hover:text-teal-900 font-semibold underline">
                    Open Live Assistant →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core AI Platform Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-teal-700 font-bold">Comprehensive Capabilities</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950 mt-2">
            The Complete Guest Journey, Reimagined
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            From pre-arrival travel curation to real-time problem resolution and executive operational insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-2xl p-6 bg-white border border-ivory-300 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 mb-2">
              Verified AI Smart Concierge
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Answers check-in rules, dining hours, pool policies, and spa reservations strictly grounded on verified hotel data retrieved from Supabase PostgreSQL. Never invents unauthorized policies.
            </p>
            <span className="text-xs text-teal-700 font-semibold flex items-center">
              Zero Hallucinations Guarantee
            </span>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl p-6 bg-white border border-ivory-300 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-royal-gold/15 text-royal-gold flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 mb-2">
              Personalized Travel Planner
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Generates rich, day-by-day itineraries based on travel style, budget tier, and cultural interests. Clearly labels estimated costs without fabricating live ticket locks.
            </p>
            <span className="text-xs text-teal-700 font-semibold flex items-center">
              Structured JSON Architecture
            </span>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl p-6 bg-white border border-ivory-300 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 mb-2">
              Multilingual Assistant
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Instantly communicates in English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Spanish, and French, providing natural hospitality across diverse international guests.
            </p>
            <span className="text-xs text-teal-700 font-semibold flex items-center">
              Native Script Precision
            </span>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl p-6 bg-white border border-ivory-300 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 mb-2">
              Smart Complaint Classification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              AI automatically categorizes incoming guest issues (housekeeping, maintenance, food, billing), determines urgency levels, and dispatches to the correct hotel department.
            </p>
            <span className="text-xs text-teal-700 font-semibold flex items-center">
              Automated Operations Dispatch
            </span>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl p-6 bg-white border border-ivory-300 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 mb-2">
              Sentiment & Feedback Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Evaluates review sentiment, scores satisfaction across room, food, and staff, and extracts key operational positives alongside necessary improvements.
            </p>
            <span className="text-xs text-teal-700 font-semibold flex items-center">
              Multivariate Guest Feedback
            </span>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl p-6 bg-white border border-ivory-300 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-teal-950 mb-2">
              Experience Gap Detector
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Aggregates real logged tickets and reviews to uncover recurring friction points, providing hotel general managers with prioritized, high-impact action recommendations.
            </p>
            <span className="text-xs text-teal-700 font-semibold flex items-center">
              Executive AI Intelligence
            </span>
          </div>
        </div>
      </section>

      {/* Two Roles, One Unified Ecosystem */}
      <section className="py-16 bg-ivory-100/70 border-t border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tourist Experience */}
            <div className="rounded-3xl bg-white p-8 border border-ivory-300 shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-teal-950">For Tourists & Guests</h3>
                  <p className="text-xs text-slate-500">Effortless luxury assistance during your journey</p>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>24/7 AI concierge grounded strictly in verified hotel facilities and policies.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Personalized travel itineraries tailored to destination, budget, and pace.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>One-click complaint logging with real-time ticket progress updates.</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center text-xs font-semibold text-teal-800 hover:text-teal-950"
              >
                Join as Tourist →
              </Link>
            </div>

            {/* Hotelier Experience */}
            <div className="rounded-3xl bg-white p-8 border border-ivory-300 shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-800 text-ivory-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-royal-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-teal-950">For Hoteliers & Staff</h3>
                  <p className="text-xs text-slate-500">Operational excellence and instant resolution dispatch</p>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Smart ticket triage with AI urgency tags and department dispatch.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time resolution speed tracking and guest sentiment analytics.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI Experience Gap Detector delivering actionable hotel improvements.</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center text-xs font-semibold text-teal-800 hover:text-teal-950"
              >
                Explore Staff Hub →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <div className="rounded-3xl bg-teal-950 text-ivory-50 p-10 md:p-14 shadow-elevated relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to Experience Intelligent Hospitality?
            </h2>
            <p className="text-sm text-teal-200/90 max-w-xl mx-auto leading-relaxed">
              Explore TripMate AI now with our verified sample 5-star hotel, pre-loaded tickets, and live Gemini assistance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/tourist/dashboard"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-teal-950 bg-royal-gold hover:bg-royal-amber transition-colors shadow-sm"
              >
                Enter Tourist Portal
              </Link>
              <Link
                to="/staff/dashboard"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-700 transition-colors"
              >
                Enter Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

