import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/tourist/dashboard';

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'hotel_staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/analytics');
      else navigate(from);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await demoLogin(role);
      if (user.role === 'hotel_staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/analytics');
      else navigate('/tourist/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory-50">
      <div className="max-w-md w-full space-y-6">
        
        {/* Card Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-ivory-50 flex items-center justify-center mx-auto shadow-sm mb-3">
            <Compass className="w-6 h-6 text-royal-gold" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-teal-950">Welcome to TripMate</h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access personalized concierge, itineraries, or staff tickets
          </p>
        </div>

        {/* Demo Roles Quick Access Box */}
        <div className="rounded-2xl p-4 bg-teal-50/80 border border-teal-200 shadow-sm">
          <div className="flex items-center space-x-2 text-teal-900 text-xs font-semibold mb-2.5">
            <Sparkles className="w-4 h-4 text-royal-gold" />
            <span>Instant Demo Evaluation (1-Click Login)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('tourist')}
              disabled={loading}
              className="py-2 px-2.5 bg-white rounded-xl border border-teal-200/80 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition-colors text-center shadow-xs disabled:opacity-50"
            >
              Tourist Guest
              <span className="block text-[10px] text-slate-500 font-normal">Elena R.</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('hotel_staff')}
              disabled={loading}
              className="py-2 px-2.5 bg-white rounded-xl border border-teal-200/80 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition-colors text-center shadow-xs disabled:opacity-50"
            >
              Hotel Staff
              <span className="block text-[10px] text-slate-500 font-normal">Vikramaditya</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="py-2 px-2.5 bg-white rounded-xl border border-teal-200/80 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition-colors text-center shadow-xs disabled:opacity-50"
            >
              Admin GM
              <span className="block text-[10px] text-slate-500 font-normal">Devendra</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl shadow-card border border-ivory-300">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tourist@tripmate.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ivory-300 rounded-xl bg-ivory-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-xl text-ivory-50 bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In to TripMate'}
              {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-ivory-200 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-900 underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

