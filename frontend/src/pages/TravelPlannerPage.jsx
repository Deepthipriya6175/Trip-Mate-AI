import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Clock,
  Printer,
  BookmarkCheck,
  Check,
  AlertCircle,
  Share2,
  Luggage,
  ChevronRight
} from 'lucide-react';

export const TravelPlannerPage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    destination: 'Jaipur, Rajasthan',
    duration_days: 3,
    budget_level: 'luxury',
    interests: ['Heritage Architecture', 'Royal Cuisine', 'Handicrafts'],
    travel_pace: 'balanced',
    currency: 'USD',
    language: user?.preferred_language || 'en'
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const interestOptions = [
    'Heritage Architecture',
    'Royal Cuisine',
    'Handicrafts & Bazaars',
    'Ayurvedic Wellness & Spa',
    'Wildlife & Nature',
    'Photography & Views',
    'Artisanal Workshops',
    'Nightlife & Cultural Shows'
  ];

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await api.post('/ai/itinerary', {
        ...formData,
        duration_days: Number(formData.duration_days)
      });

      if (res.data?.data) {
        setItinerary(res.data.data);
      }
    } catch (err) {
      console.error('Itinerary error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!itinerary || saving) return;
    setSaving(true);
    try {
      await api.post('/itineraries', {
        title: itinerary.title,
        destination: itinerary.destination,
        duration_days: itinerary.duration_days,
        budget_level: itinerary.budget_level,
        interests: formData.interests,
        itinerary_data: itinerary,
        total_estimated_cost: itinerary.estimated_total_cost,
        currency: formData.currency
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save itinerary: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Intelligent Trip Curation
        </span>
        <h1 className="font-serif text-3xl font-bold text-teal-950 mt-1">
          Personalized Travel Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Generate realistic, structured travel plans with labeled expense estimates, dining recommendations, and local cultural guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-ivory-300 shadow-card">
          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Destination</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Jaipur, Rajasthan or North Goa"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            {/* Duration & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 7].map((d) => (
                      <option key={d} value={d}>
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Level</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={formData.budget_level}
                    onChange={(e) => setFormData({ ...formData, budget_level: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none capitalize"
                  >
                    <option value="budget">Budget Friendly</option>
                    <option value="moderate">Moderate Comfort</option>
                    <option value="luxury">Luxury Heritage</option>
                    <option value="ultra_luxury">Ultra Bespoke</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Currency & Pace */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Pace</label>
                <select
                  value={formData.travel_pace}
                  onChange={(e) => setFormData({ ...formData, travel_pace: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none capitalize"
                >
                  <option value="relaxed">Relaxed (Unrushed)</option>
                  <option value="balanced">Balanced (Optimal)</option>
                  <option value="packed">Fast-Paced (High Sights)</option>
                </select>
              </div>
            </div>

            {/* Travel Interests Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Travel Style & Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((interest) => {
                  const selected = formData.interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selected
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-ivory-100 text-slate-600 hover:bg-ivory-200 border border-ivory-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center py-3 px-4 text-xs font-semibold rounded-xl text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Custom Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-royal-gold" />
                  Generate Itinerary with Gemini AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output Itinerary */}
        <div className="lg:col-span-7">
          {!itinerary && !loading && (
            <div className="bg-white rounded-3xl p-10 border border-dashed border-ivory-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto">
                <Luggage className="w-6 h-6 text-royal-gold" />
              </div>
              <h3 className="font-serif text-lg font-bold text-teal-950">No Itinerary Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select your destination, duration, and preferences on the left, then click Generate to create an authentic travel roadmap.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl p-12 border border-ivory-300 shadow-card text-center space-y-4">
              <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h3 className="font-serif text-lg font-bold text-teal-950">Crafting Your Tailored Journey</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Synthesizing landmark hours, heritage culinary pairings, and route efficiency...
              </p>
            </div>
          )}

          {itinerary && !loading && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-card space-y-6">
              
              {/* Header and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {itinerary.duration_days} Days • {itinerary.budget_level}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-teal-950 mt-1">
                    {itinerary.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {itinerary.overview}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveToVault}
                    disabled={saving}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl text-teal-900 bg-ivory-200 hover:bg-ivory-300 border border-ivory-300 transition-colors"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Saved!
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 mr-1 text-teal-700" /> Save Trip
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-ivory-200 transition-colors"
                    title="Print itinerary"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Estimated Budget Card */}
              <div className="rounded-2xl p-4 bg-teal-50/60 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div>
                  <span className="font-semibold text-teal-950 block">Total Estimated Cost (Labeled):</span>
                  <span className="text-slate-600">{itinerary.estimated_total_cost}</span>
                </div>
                <div className="text-[11px] text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-teal-200/80">
                  {itinerary.disclaimer}
                </div>
              </div>

              {/* Day-by-Day Timeline */}
              <div className="space-y-6">
                {itinerary.days?.map((dayPlan) => (
                  <div key={dayPlan.day} className="space-y-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-teal-800 text-ivory-50 text-xs font-bold flex items-center justify-center font-serif">
                        {dayPlan.day}
                      </span>
                      <h4 className="font-serif text-base font-bold text-teal-950">
                        Day {dayPlan.day}: {dayPlan.theme}
                      </h4>
                    </div>

                    <div className="ml-3.5 pl-4 border-l-2 border-ivory-300 space-y-3">
                      {dayPlan.activities?.map((act, actIdx) => (
                        <div
                          key={actIdx}
                          className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-teal-900 flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1 text-royal-gold" />
                              {act.time} — {act.title}
                            </span>
                            {act.estimated_cost && (
                              <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-ivory-300">
                                {act.estimated_cost}
                              </span>
                            )}
                          </div>

                          <p className="text-slate-600 leading-relaxed">
                            {act.description}
                          </p>

                          {act.tip && (
                            <p className="text-[11px] text-teal-800 font-medium">
                              💡 <strong>Local Tip:</strong> {act.tip}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Packing Tips */}
              {itinerary.packing_tips?.length > 0 && (
                <div className="pt-4 border-t border-ivory-200 text-xs text-slate-600">
                  <span className="font-semibold text-teal-950 block mb-1">Recommended Essentials:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {itinerary.packing_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};

