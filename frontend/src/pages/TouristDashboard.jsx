import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatusBadge, UrgencyBadge } from '../components/Badge';
import {
  Sparkles,
  MessageSquare,
  MapPin,
  AlertCircle,
  Star,
  Clock,
  Wifi,
  Coffee,
  Shield,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Building
} from 'lucide-react';

export const TouristDashboard = () => {
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [hotelRes, complaintsRes, itinerariesRes] = await Promise.all([
          api.get('/hotels/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
          api.get('/complaints'),
          api.get('/itineraries')
        ]);

        if (hotelRes.data?.data) setHotel(hotelRes.data.data);
        if (complaintsRes.data?.data) setComplaints(complaintsRes.data.data);
        if (itinerariesRes.data?.data) setItineraries(itinerariesRes.data.data);
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openTickets = complaints.filter(c => ['pending', 'in_progress', 'escalated'].includes(c.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ivory-300">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Guest Experience Vault
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-teal-950">
            Welcome, {user?.full_name || 'Elena'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your personal AI concierge, itineraries, and hospitality service tracker.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/concierge"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4 mr-1.5 text-royal-gold" />
            Launch AI Concierge
          </Link>
          <Link
            to="/complaints"
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-teal-900 bg-ivory-200 hover:bg-ivory-300 border border-ivory-300 transition-colors"
          >
            <AlertCircle className="w-4 h-4 mr-1.5 text-rose-600" />
            Report Issue
          </Link>
        </div>
      </div>

      {/* Verified Hotel Stay Card */}
      {hotel && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-ivory-50 p-6 sm:p-8 shadow-card border border-teal-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 text-royal-gold text-xs font-medium backdrop-blur-xs">
                <Star className="w-3.5 h-3.5 fill-royal-gold" />
                <span>Verified Active Stay • {hotel.star_rating} Star Royal Resort</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                {hotel.name}
              </h2>
              <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
                {hotel.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-teal-200">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-royal-gold" />
                  <span>{hotel.address}, {hotel.city}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-royal-gold" />
                  <span>Check-in: {hotel.check_in_time} | Check-out: {hotel.check_out_time}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Wifi className="w-4 h-4 text-royal-gold" />
                  <span>High-speed Wi-Fi 6 Included</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center sm:items-end space-y-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-full sm:w-auto text-center sm:text-right">
                <span className="text-[11px] text-teal-200 uppercase tracking-wider block">Assistance Hotline</span>
                <span className="font-serif text-lg font-bold text-royal-gold block">{hotel.contact_phone}</span>
                <span className="text-[10px] text-teal-200/70 block">Room Intercom: Dial 0 for Reception</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4 Interactive Feature Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link
          to="/concierge"
          className="group p-5 rounded-2xl bg-white border border-ivory-300 shadow-card hover:shadow-elevated hover:border-teal-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 text-royal-gold" />
          </div>
          <h3 className="font-serif text-base font-bold text-teal-950 mb-1">
            AI Hotel Concierge
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Ask dining times, pool rules, spa bookings, and verified hotel amenities in multiple languages.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center group-hover:translate-x-0.5 transition-transform">
            Chat Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/planner"
          className="group p-5 rounded-2xl bg-white border border-ivory-300 shadow-card hover:shadow-elevated hover:border-teal-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-royal-gold/15 text-royal-gold flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-teal-950 mb-1">
            Personalized Travel Planner
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Generate day-by-day itineraries with estimated budgets, local tips, and cultural hotspots.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center group-hover:translate-x-0.5 transition-transform">
            Create Trip <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/complaints"
          className="group p-5 rounded-2xl bg-white border border-ivory-300 shadow-card hover:shadow-elevated hover:border-teal-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-teal-950 mb-1">
            Report Issue & Tickets
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Smart AI classification automatically determines department and tracks live resolution status.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center group-hover:translate-x-0.5 transition-transform">
            {openTickets.length > 0 ? `${openTickets.length} Active Ticket` : 'Submit Ticket'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          to="/feedback"
          className="group p-5 rounded-2xl bg-white border border-ivory-300 shadow-card hover:shadow-elevated hover:border-teal-400 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 text-royal-gold" />
          </div>
          <h3 className="font-serif text-base font-bold text-teal-950 mb-1">
            Guest Experience Review
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Rate cleanliness, staff, food, and room comfort with instant AI sentiment scoring.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center group-hover:translate-x-0.5 transition-transform">
            Write Review <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

      </div>

      {/* Split Section: Active Tickets & Recent Itineraries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Tickets Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-teal-950 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-rose-600" />
              Active Tickets & Requests
            </h3>
            <Link to="/complaints" className="text-xs font-semibold text-teal-700 hover:text-teal-900">
              View All ({complaints.length})
            </Link>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-ivory-300 text-center text-xs text-slate-500">
                No active complaints. Your stay is in pristine condition!
              </div>
            ) : (
              complaints.slice(0, 3).map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-xs space-y-2 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        #{ticket.id.substring(0, 8)}
                      </span>
                      {ticket.room_number && (
                        <span className="bg-ivory-200 text-teal-900 font-semibold px-2 py-0.5 rounded text-[10px]">
                          Room {ticket.room_number}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <UrgencyBadge urgency={ticket.urgency} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-teal-950">
                    {ticket.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {ticket.description}
                  </p>

                  {ticket.resolution_notes && (
                    <div className="pt-2 border-t border-ivory-200 text-[11px] text-teal-800 bg-teal-50/50 p-2 rounded-lg">
                      <strong>Staff Note:</strong> {ticket.resolution_notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Itineraries Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-teal-950 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-royal-gold" />
              Saved Travel Itineraries
            </h3>
            <Link to="/planner" className="text-xs font-semibold text-teal-700 hover:text-teal-900">
              Create New Plan →
            </Link>
          </div>

          <div className="space-y-3">
            {itineraries.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-ivory-300 text-center text-xs text-slate-500">
                You haven't generated custom travel plans yet.
                <div className="mt-2">
                  <Link to="/planner" className="text-teal-700 underline font-semibold">
                    Plan your next destination now
                  </Link>
                </div>
              </div>
            ) : (
              itineraries.slice(0, 2).map((itin) => (
                <div
                  key={itin.id}
                  className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-xs space-y-2 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-teal-950 text-sm">
                      {itin.title}
                    </span>
                    <span className="bg-royal-sand text-teal-900 font-semibold px-2 py-0.5 rounded text-[10px] capitalize">
                      {itin.budget_level}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 space-x-4">
                    <span>📍 {itin.destination}</span>
                    <span>⏳ {itin.duration_days} Days</span>
                    <span>💰 {itin.total_estimated_cost}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {itin.itinerary_data?.overview || 'Comprehensive curated travel roadmap.'}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <Link
                      to="/planner"
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center"
                    >
                      View Full Itinerary <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

