import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Captcha from './Captcha';

export default function AuthForms({ onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const captchaToken = captchaRef.current ? captchaRef.current.getToken() : null;
    const captchaAnswer = captchaRef.current ? captchaRef.current.getAnswer() : '';

    try {
      if (mode === 'login') {
        await login(form.email, form.password, captchaToken, captchaAnswer);
      } else {
        await register(form.name, form.email, form.password, captchaToken, captchaAnswer);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      if (captchaRef.current) captchaRef.current.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-forms">
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
          onClick={() => { setMode('login'); setError(''); }}
        >
          Log in
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
          onClick={() => { setMode('register'); setError(''); }}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="alert alert-error">{error}</div>}

        {mode === 'register' && (
          <input
            type="text" name="name" placeholder="Full name"
            value={form.name} onChange={handleChange} required
          />
        )}
        <input
          type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required
        />
        <input
          type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required
          minLength={mode === 'register' ? 8 : undefined}
        />
        {mode === 'register' && (
          <p className="auth-hint">At least 8 characters, with a letter and a number.</p>
        )}

        <Captcha ref={captchaRef} />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
