import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-teal-900 font-serif text-sm">Loading TripMate AI...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    // Redirect to their default dashboard if unauthorized for this specific role
    if (user.role === 'hotel_staff') {
      return <Navigate to="/staff/dashboard" replace />;
    }
    return <Navigate to="/tourist/dashboard" replace />;
  }

  return children;
};

