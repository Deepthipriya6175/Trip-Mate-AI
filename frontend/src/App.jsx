import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TouristDashboard } from './pages/TouristDashboard';
import { ConciergeChatPage } from './pages/ConciergeChatPage';
import { TravelPlannerPage } from './pages/TravelPlannerPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { ComplaintManagementPage } from './pages/ComplaintManagementPage';
import { AdminAnalyticsDashboard } from './pages/AdminAnalyticsDashboard';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public Access */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/concierge" element={<ConciergeChatPage />} />
            <Route path="/planner" element={<TravelPlannerPage />} />

            {/* Tourist Protected Routes */}
            <Route
              path="/tourist/dashboard"
              element={
                <ProtectedRoute allowedRoles={['tourist', 'admin']}>
                  <TouristDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <ProtectedRoute allowedRoles={['tourist', 'hotel_staff', 'admin']}>
                  <ComplaintsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute allowedRoles={['tourist', 'hotel_staff', 'admin']}>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />

            {/* Hotel Staff & Admin Protected Routes */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={['hotel_staff', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/tickets"
              element={
                <ProtectedRoute allowedRoles={['hotel_staff', 'admin']}>
                  <ComplaintManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['hotel_staff', 'admin']}>
                  <AdminAnalyticsDashboard />
                </ProtectedRoute>
              }
            />

            {/* Common Authenticated Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

