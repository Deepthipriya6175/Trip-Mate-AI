import React from 'react';
import { Compass, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-teal-950 text-ivory-100 border-t border-teal-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-royal-gold/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-royal-gold" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-ivory-50">
                TripMate <span className="text-royal-gold">AI</span>
              </span>
            </div>
            <p className="text-xs text-teal-200/80 leading-relaxed">
              Elevating the global hospitality experience. Seamlessly connecting luxury travelers with verified hotel intelligence, smart ticketing, and AI concierge services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-royal-gold mb-3">For Tourists</h4>
            <ul className="space-y-2 text-xs text-teal-100/70">
              <li><a href="/concierge" className="hover:text-ivory-50 transition-colors">AI Smart Concierge</a></li>
              <li><a href="/planner" className="hover:text-ivory-50 transition-colors">Curated Trip Planner</a></li>
              <li><a href="/complaints" className="hover:text-ivory-50 transition-colors">Real-time Issue Tracking</a></li>
              <li><a href="/feedback" className="hover:text-ivory-50 transition-colors">Guest Experience Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-royal-gold mb-3">For Hoteliers</h4>
            <ul className="space-y-2 text-xs text-teal-100/70">
              <li><a href="/staff/dashboard" className="hover:text-ivory-50 transition-colors">Staff Operations Hub</a></li>
              <li><a href="/staff/tickets" className="hover:text-ivory-50 transition-colors">Smart Complaint Dispatch</a></li>
              <li><a href="/admin/analytics" className="hover:text-ivory-50 transition-colors">Experience Gap Detector</a></li>
              <li><a href="/admin/analytics" className="hover:text-ivory-50 transition-colors">Sentiment Analytics</a></li>
            </ul>
          </div>

          {/* Trust & Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-royal-gold mb-3">Enterprise Standards</h4>
            <div className="space-y-2 text-xs text-teal-100/70">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Supabase Row-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-royal-gold" />
                <span>Grounded Google Gemini AI</span>
              </div>
              <div className="text-[11px] text-teal-300/60 pt-2">
                Verified hotel data grounding prevents hallucinated amenities or policies.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-teal-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-300/60">
          <p>© {new Date().getFullYear()} TripMate AI Hospitality Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Crafted for world-class luxury stays & smart tourism.
          </p>
        </div>
      </div>
    </footer>
  );
};

