import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { api } from '../api';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

/**
 * Updated Captcha Component
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
      <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading captcha...</span>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="w-full p-4 bg-green-50 border border-green-300 rounded-lg flex gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-900">✓ Captcha Verified!</p>
          <p className="text-sm text-green-700">You can now submit the form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Challenge Display */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4">
        <p className="text-xs text-gray-600 mb-2 font-semibold">Enter the text shown below:</p>
        <div className="bg-white border-2 border-gray-300 rounded px-4 py-3 font-mono text-2xl font-bold text-center tracking-widest select-none">
          {challenge || '......'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Input Field */}
      <div>
        <label htmlFor="captcha-input" className="block text-sm font-medium text-gray-700 mb-2">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoComplete="off"
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">
          Case-insensitive • Expires in 5 minutes
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleVerify}
          disabled={verifying || !captchaId}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {verifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          title="Get a new captcha"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reload</span>
        </button>
      </div>
    </div>
  );
});

export default Captcha;