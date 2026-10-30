import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Compass,
  MessageSquare,
  Map,
  AlertCircle,
  Star,
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferred_language || 'en');

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    // Can dispatch or update profile
  };

  const handleDemoSwitch = async (role) => {
    try {
      await demoLogin(role);
      setDemoDropdownOpen(false);
      if (role === 'hotel_staff') navigate('/staff/dashboard');
      else if (role === 'admin') navigate('/admin/analytics');
      else navigate('/tourist/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur-md border-b border-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-ivory-50 flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-royal-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-teal-950">
                TripMate<span className="text-royal-gold font-sans text-xs ml-1 font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-ivory-200">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-teal-700 font-semibold -mt-0.5">
                Hospitality Experience
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/concierge"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/concierge') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  AI Concierge
                </Link>
                <Link
                  to="/planner"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/planner') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  Trip Planner
                </Link>
              </>
            ) : user?.role === 'tourist' ? (
              <>
                <Link
                  to="/tourist/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/tourist/dashboard') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/concierge"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/concierge') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-1.5 text-teal-600" />
                  AI Concierge
                </Link>
                <Link
                  to="/planner"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/planner') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <Map className="w-4 h-4 mr-1.5 text-teal-600" />
                  Planner
                </Link>
                <Link
                  to="/complaints"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/complaints') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 mr-1.5 text-teal-600" />
                  My Tickets
                </Link>
                <Link
                  to="/feedback"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/feedback') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <Star className="w-4 h-4 mr-1.5 text-royal-gold" />
                  Feedback
                </Link>
              </>
            ) : (
              // Hotel Staff or Admin links
              <>
                <Link
                  to="/staff/dashboard"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/staff/dashboard') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5 text-teal-600" />
                  Staff Overview
                </Link>
                <Link
                  to="/staff/tickets"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/staff/tickets') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 mr-1.5 text-teal-600" />
                  Ticket Desk
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/analytics') ? 'text-teal-900 bg-ivory-200' : 'text-slate-600 hover:text-teal-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-1.5 text-teal-600" />
                  Executive Analytics
                </Link>
              </>
            )}
          </div>

          {/* Right Controls: Language, Quick Demo Switcher, User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector
              currentLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              compact={true}
            />

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
                title="Quickly switch demo personas"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-royal-gold" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-elevated border border-ivory-300 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Switch Persona
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('tourist')}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-100 flex items-center justify-between text-slate-700"
                  >
                    <span>Elena Rostova (Tourist)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Guest</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('hotel_staff')}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-100 flex items-center justify-between text-slate-700"
                  >
                    <span>Vikramaditya (Staff)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Staff</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-100 flex items-center justify-between text-slate-700"
                  >
                    <span>Devendra Singh (Admin)</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons or User Profile Menu */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-teal-800 hover:text-teal-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-ivory-50 bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-teal-950 bg-ivory-100 border border-ivory-300 rounded-xl px-2.5 py-1.5 hover:bg-ivory-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-800 text-ivory-50 text-xs flex items-center justify-center font-bold">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user.full_name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                    {user.role}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-ivory-300 py-1.5 z-50 text-sm">
                    <div className="px-3 py-2 border-b border-ivory-200">
                      <p className="font-semibold text-slate-800 truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-3 py-2 text-slate-700 hover:bg-ivory-100 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2 text-teal-700" />
                      Profile & Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left flex items-center px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSelector
              currentLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              compact={true}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-teal-900 hover:bg-ivory-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ivory-200 bg-ivory-50 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
            >
              Home
            </Link>
            <Link
              to="/concierge"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
            >
              AI Concierge
            </Link>
            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
            >
              Trip Planner
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to={user?.role === 'tourist' ? '/tourist/dashboard' : '/staff/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
                >
                  Tickets & Issues
                </Link>
                <Link
                  to="/feedback"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
                >
                  Guest Feedback
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-ivory-200"
                >
                  Profile & Settings
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-ivory-200">
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase">Quick Demo Login</div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => { handleDemoSwitch('tourist'); setMobileMenuOpen(false); }}
                className="py-1.5 px-2 text-xs bg-ivory-200 rounded font-medium text-slate-800"
              >
                Tourist
              </button>
              <button
                onClick={() => { handleDemoSwitch('hotel_staff'); setMobileMenuOpen(false); }}
                className="py-1.5 px-2 text-xs bg-ivory-200 rounded font-medium text-slate-800"
              >
                Staff
              </button>
              <button
                onClick={() => { handleDemoSwitch('admin'); setMobileMenuOpen(false); }}
                className="py-1.5 px-2 text-xs bg-ivory-200 rounded font-medium text-slate-800"
              >
                Admin
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full text-center py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-xl"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex space-x-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium text-teal-900 bg-ivory-200 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium text-ivory-50 bg-teal-700 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

