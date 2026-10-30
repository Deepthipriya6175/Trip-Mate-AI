import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tripmate_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('tripmate_token');
      const storedUser = localStorage.getItem('tripmate_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('tripmate_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('tripmate_token', newToken);
      localStorage.setItem('tripmate_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.error || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('tripmate_token', newToken);
      localStorage.setItem('tripmate_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.error || 'Registration failed');
  };

  const demoLogin = async (role = 'tourist') => {
    const res = await api.post('/auth/demo-login', { role });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('tripmate_token', newToken);
      localStorage.setItem('tripmate_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.error || 'Demo login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tripmate_token');
    localStorage.removeItem('tripmate_user');
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('tripmate_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        isTourist: user?.role === 'tourist',
        isStaff: user?.role === 'hotel_staff' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

