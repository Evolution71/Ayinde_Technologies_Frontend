import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { api } from '../api';

/**
 * Updated Captcha Component - NO lucide-react dependency
 * 
 * Uses database-backed text captchas instead of math challenges
 * Exposes ref methods: getToken(), getAnswer(), refresh()
 * For use in forms like Contact, Registration, etc.
 * 
 * Usage:
 *   const captchaRef = useRef();
 *   <Captcha ref={captchaRef} />
 *   
 *   // On form submit:
 *   const id = captchaRef.current.getToken();
 *   const answer = captchaRef.current.getAnswer();
 */
const Captcha = forwardRef(function Captcha(_props, ref) {
  const [captchaId, setCaptchaId] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError('');
      setVerified(false);
      setAnswer('');
      
      const data = await api.getCaptcha();
      
      // New format: captcha_id, captcha_image (text), expires_at
      setCaptchaId(data.captcha_id);
      setChallenge(data.captcha_image); // This is the text to display
      
      console.log('[Captcha] Loaded:', {
        id: data.captcha_id,
        challenge: data.captcha_image
      });
    } catch (e) {
      console.error('[Captcha] Load error:', e);
      setError("Failed to load captcha — backend issue?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getToken: () => captchaId,
    getAnswer: () => answer,
    refresh: load,
    isVerified: () => verified,
  }));

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!captchaId) {
      setError('Captcha not loaded');
      return;
    }

    if (!answer.trim()) {
      setError('Please enter the text');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // Call new verify endpoint with correct format
      const result = await api.verifyCaptcha(captchaId, answer);
      
      if (result.success) {
        setVerified(true);
        console.log('[Captcha] Verified successfully');
      } else {
        setError(result.message || 'Verification failed');
        console.log('[Captcha] Verification failed:', result.message);
      }
    } catch (err) {
      console.error('[Captcha] Verify error:', err);
      setError(err.message || 'Error verifying');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '0.5rem',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '1.25rem',
            height: '1.25rem',
            border: '3px solid #2563eb',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: '#666' }}>Loading captcha...</span>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (verified) {
    return (
      <div style={{
        width: '100%',
        padding: '1rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '0.5rem',
        display: 'flex',
        gap: '0.75rem'
      }}>
        <div style={{ fontSize: '1.25rem' }}>✓</div>
        <div>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#166534' }}>
            ✓ Captcha Verified!
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#15803d' }}>
            You can now submit the form
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Challenge Display */}
      <div style={{
        background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
        border: '2px solid #60a5fa',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>
          Enter the text shown below:
        </p>
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #ccc',
          borderRadius: '0.375rem',
          padding: '0.75rem',
          fontFamily: 'monospace',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: '0.125rem',
          userSelect: 'none'
        }}>
          {challenge || '......'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '1.25rem', color: '#dc2626' }}>⚠</div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#991b1b' }}>
            {error}
          </p>
        </div>
      )}

      {/* Input Field */}
      <div>
        <label htmlFor="captcha-input" style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Your Answer
        </label>
        <input
          id="captcha-input"
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError('');
          }}
          placeholder="Type the text above"
          disabled={verifying}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            cursor: verifying ? 'not-allowed' : 'text',
            backgroundColor: verifying ? '#f3f4f6' : 'white',
            opacity: verifying ? 0.6 : 1
          }}
          autoComplete="off"
          autoFocus
        />
        <p style={{
          margin: '0.25rem 0 0 0',
          fontSize: '0.75rem',
          color: '#666'
        }}>
          Case-insensitive • Expires in 5 minutes
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button
          onClick={handleVerify}
          disabled={verifying || !captchaId}
          style={{
            flex: 1,
            backgroundColor: verifying || !captchaId ? '#d1d5db' : '#2563eb',
            color: 'white',
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: verifying || !captchaId ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!verifying && captchaId) {
              e.target.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseLeave={(e) => {
            if (!verifying && captchaId) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
        >
          {verifying ? (
            <>
              <div style={{
                width: '1rem',
                height: '1rem',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </button>

        <button
          type="button"
          onClick={load}
          disabled={loading || verifying}
          style={{
            backgroundColor: loading || verifying ? '#e5e7eb' : '#e5e7eb',
            color: '#1f2937',
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: loading || verifying ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            minWidth: '100px'
          }}
          onMouseEnter={(e) => {
            if (!loading && !verifying) {
              e.target.style.backgroundColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !verifying) {
              e.target.style.backgroundColor = '#e5e7eb';
            }
          }}
          title="Get a new captcha"
        >
          <span style={{ fontSize: '1.25rem' }}>↻</span>
          <span style={{ display: 'none' }}>Reload</span>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export default Captcha;