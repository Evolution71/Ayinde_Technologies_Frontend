import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, AUTH_EXPIRED_EVENT } from '../api';

// Returns true if the JWT's "exp" time has passed (or the token can't be read).
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch (e) {
    return true;
  }
};

const safeGet = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};

const safeRemove = (key) => {
  try { localStorage.removeItem(key); } catch (e) { /* storage blocked */ }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(null);

  useEffect(() => {
    // ✅ FIXED: Use consistent 'ayinde_token' key with api.js
    const storedToken = safeGet('ayinde_token');
    const userData = safeGet('user');

    // Expired token: clear it so the navbar doesn't say "Hi, <name>" while
    // every protected request fails with 401.
    if (storedToken && isTokenExpired(storedToken)) {
      safeRemove('ayinde_token');
      safeRemove('user');
    } else if (storedToken && userData) {
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

    // Backend rejected the token mid-session → log out of the UI as well.
    const handleExpired = () => {
      setTokenState(null);
      setUser(null);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);

    // Also catch a token that expires while the tab stays open.
    const timer = setInterval(() => {
      const t = safeGet('ayinde_token');
      if (t && isTokenExpired(t)) {
        safeRemove('ayinde_token');
        safeRemove('user');
        handleExpired();
      }
    }, 60 * 1000);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
      clearInterval(timer);
    };
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

  const register = async (first_name, last_name, email, password, captchaToken, captchaAnswer, termsAccepted) => {
    try {
      const response = await api.register(
        first_name, last_name, email, password, captchaToken, captchaAnswer, termsAccepted
      );
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
    safeRemove('ayinde_token');
    safeRemove('user');
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