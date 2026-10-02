import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('ayinde_token'); // ← FIXED: Changed from 'token' to 'ayinde_token'
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user details from backend
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('ayinde_token', data.access_token); // ← FIXED: Changed from 'token' to 'ayinde_token'
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (firstName, lastName, email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password })
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('ayinde_token', data.access_token); // ← FIXED: Changed from 'token' to 'ayinde_token'
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ayinde_token'); // ← FIXED: Changed from 'token' to 'ayinde_token'
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};