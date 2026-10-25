import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Captcha from './Captcha';

// mode: 'login' | 'register' | 'forgot'
export default function AuthForms({ onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef(null);

  function switchMode(next) {
    setMode(next);
    setError('');
    setNotice('');
    if (captchaRef.current) captchaRef.current.refresh();
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const captchaToken = captchaRef.current ? captchaRef.current.getToken() : null;
    const captchaAnswer = captchaRef.current ? captchaRef.current.getAnswer() : '';

    try {
      if (mode === 'login') {
        await login(form.email, form.password, captchaToken, captchaAnswer);
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        if (!termsAccepted) {
          throw new Error('Please accept the Privacy Policy and Terms and Conditions to continue.');
        }
        await register(form.first_name, form.last_name, form.email, form.password, captchaToken, captchaAnswer, termsAccepted);
        if (onSuccess) onSuccess();
      } else {
        const res = await api.forgotPassword(form.email, captchaToken, captchaAnswer);
        setNotice(res.message);
        if (captchaRef.current) captchaRef.current.refresh();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      if (captchaRef.current) captchaRef.current.refresh();
    } finally {
      setLoading(false);
    }
  }

  const title = mode === 'login' ? 'Log in' : mode === 'register' ? 'Create account' : 'Reset password';
  const buttonText = loading
    ? 'Please wait...'
    : mode === 'login' ? 'Log in' : mode === 'register' ? 'Create account' : 'Send reset link';

  return (
    <div className="auth-forms">
      {mode !== 'forgot' && (
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('register')}
          >
            Create account
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" aria-label={title}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {notice && <div className="alert alert-success" role="status">{notice}</div>}

        {mode === 'forgot' && (
          <p className="auth-hint">Enter the email you signed up with and we will send you a link to choose a new password.</p>
        )}

        {mode === 'register' && (
          <>
            <input
              type="text" name="first_name" placeholder="First name"
              value={form.first_name} onChange={handleChange} required
            />
            <input
              type="text" name="last_name" placeholder="Last name"
              value={form.last_name} onChange={handleChange} required
            />
          </>
        )}

        <input
          type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required
        />

        {mode !== 'forgot' && (
          <input
            type="password" name="password" placeholder="Password"
            value={form.password} onChange={handleChange} required
            minLength={mode === 'register' ? 8 : undefined}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
        )}

        {mode === 'register' && (
          <p className="auth-hint">At least 8 characters, with a letter and a number.</p>
        )}

        {mode === 'login' && (
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              className="auth-link"
              onClick={() => switchMode('forgot')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#1e40af', textDecoration: 'underline', cursor: 'pointer', fontSize: 14 }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {mode === 'register' && (
          <label
            className="form-check form-switch"
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.5, cursor: 'pointer' }}
          >
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="accept-terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{ marginTop: 4, flexShrink: 0 }}
            />
            <span>
              I agree to the{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
              {' '}and{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</Link>.
            </span>
          </label>
        )}

        <Captcha ref={captchaRef} />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {buttonText}
        </button>

        {mode === 'forgot' && (
          <button
            type="button"
            className="auth-link"
            onClick={() => switchMode('login')}
            style={{ background: 'none', border: 'none', padding: 0, color: '#1e40af', textDecoration: 'underline', cursor: 'pointer', fontSize: 14 }}
          >
            Back to log in
          </button>
        )}
      </form>
    </div>
  );
}
