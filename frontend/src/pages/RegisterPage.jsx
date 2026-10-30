import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, Phone, Globe, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import { LANGUAGES } from '../components/LanguageSelector';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'tourist',
    preferred_language: 'en',
    hotel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === 'hotel_staff') navigate('/staff/dashboard');
      else navigate('/tourist/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory-50">
      <div className="max-w-md w-full space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-ivory-50 flex items-center justify-center mx-auto shadow-sm mb-3">
            <Compass className="w-6 h-6 text-royal-gold" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-teal-950">Join TripMate AI</h2>
          <p className="mt-1 text-xs text-slate-500">
            Create your personalized hospitality and travel account
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-card border border-ivory-300">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">I am registering as</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tourist' })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    formData.role === 'tourist'
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-ivory-100 text-slate-700 border-ivory-300 hover:bg-ivory-200'
                  }`}
                >
                  Tourist / Guest
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'hotel_staff' })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    formData.role === 'hotel_staff'
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-ivory-100 text-slate-700 border-ivory-300 hover:bg-ivory-200'
                  }`}
                >
                  Hotel Staff
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0100"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={formData.preferred_language}
                    onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {formData.role === 'hotel_staff' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Property</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={formData.hotel_id}
                    onChange={(e) => setFormData({ ...formData, hotel_id: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 appearance-none"
                  >
                    <option value="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa">
                      The Grand Heritage Palace (Jaipur)
                    </option>
                    <option value="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb">
                      Azure Coastal Resort & Spa (Goa)
                    </option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-xl text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
              {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-ivory-200 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-900 underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

