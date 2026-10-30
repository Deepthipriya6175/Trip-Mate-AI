import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../components/LanguageSelector';
import { User, Mail, Phone, Globe, Shield, Save, CheckCircle2 } from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    preferred_language: user?.preferred_language || 'en',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="pb-2 border-b border-ivory-300">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Account Administration
        </span>
        <h1 className="font-serif text-3xl font-bold text-teal-950 mt-1">
          Profile & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal details, preferred AI concierge language, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Profile preferences updated successfully!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0192"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred AI Language</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={formData.preferred_language}
                  onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label} ({lang.native})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm flex items-center"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Role Privileges Badge Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-card text-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-ivory-50 flex items-center justify-center font-bold text-lg mb-2">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Role</span>
              <h3 className="font-serif text-lg font-bold text-teal-950 capitalize">{user?.role}</h3>
            </div>

            <div className="pt-2 border-t border-ivory-200 space-y-1.5 text-slate-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>JWT Authentication Valid</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {user?.role === 'tourist' && 'Authorized to access personalized concierge, trip planner, personal tickets, and stay reviews.'}
                {user?.role === 'hotel_staff' && 'Authorized to view assigned hotel complaints, update ticket statuses, and log internal staff resolution notes.'}
                {user?.role === 'admin' && 'Full administrative oversight: hotel configurations, complaint resolution dispatch, and AI gap analytics.'}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

