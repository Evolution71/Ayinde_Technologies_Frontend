import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(null);

  useEffect(() => {
    // ✅ FIXED: Use consistent 'ayinde_token' key with api.js
    const storedToken = localStorage.getItem('ayinde_token');
    const userData = localStorage.getItem('user');

    if (storedToken && userData) {
      try {
        setTokenState(storedToken);
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('ayinde_token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password, captchaToken, captchaAnswer) => {
    try {
      const response = await api.login(email, password, captchaToken, captchaAnswer);
      // ✅ FIXED: Store token using 'ayinde_token' key to match api.js
      localStorage.setItem('ayinde_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setTokenState(response.access_token);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (first_name, last_name, email, password, captchaToken, captchaAnswer) => {
    try {
      const response = await api.register(first_name, last_name, email, password, captchaToken, captchaAnswer);
      // ✅ FIXED: Store token using 'ayinde_token' key to match api.js
      localStorage.setItem('ayinde_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setTokenState(response.access_token);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('ayinde_token');
    localStorage.removeItem('user');
    setTokenState(null);
    setUser(null);
    api.logout?.();
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthProvider;