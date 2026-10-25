import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

// Opened from the link in the reset email: /reset-password?token=...
const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword(token, password);
      setDone(true);
      setPassword('');
      setConfirm('');
      setError(res.message || '');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const box = {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };
  const input = {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 14,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 15,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 20 }}>
      <div style={box}>
        <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '30px 20px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: 26 }}>Choose a new password</h1>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>Use at least 8 characters, with a letter and a number.</p>
        </div>

        <div style={{ padding: '30px 20px' }}>
          {!token && (
            <div className="alert alert-error" role="alert">
              This reset link is incomplete. Please use the link from your email, or request a new one.
            </div>
          )}

          {error && (
            <div className={done ? 'alert alert-success' : 'alert alert-error'} role={done ? 'status' : 'alert'}>
              {error}
            </div>
          )}

          {done ? (
            <Link to="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Go to log in
            </Link>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
                style={input}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
                style={input}
              />
              <button type="submit" className="btn btn-primary" disabled={loading || !token} style={{ width: '100%' }}>
                {loading ? 'Saving...' : 'Save new password'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
            <Link to="/login">Back to log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
