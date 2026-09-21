import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { api } from '../api';

/**
 * Captcha widget. Exposes `getToken()` and `getAnswer()` via ref so parent
 * forms can read the current challenge when submitting, and `refresh()` to
 * pull a new one (used after a failed submission).
 */
const Captcha = forwardRef(function Captcha(_props, ref) {
  const [captchaId, setCaptchaId] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await api.getCaptcha();
      // Backend returns: { captcha_id, captcha_image }
      setCaptchaId(data.captcha_id);
      setChallenge(data.captcha_image);
      setAnswer('');
      setError('');
    } catch (e) {
      console.error('Captcha load error:', e);
      setError("Couldn't load the captcha — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  useImperativeHandle(ref, () => ({
    getToken: () => captchaId,
    getAnswer: () => answer,
    refresh: load,
  }));

  if (loading) {
    return <div className="captcha-widget"><p>Loading captcha...</p></div>;
  }

  return (
    <div className="captcha-widget">
      <label htmlFor="captcha-input">Solve this challenge</label>
      <div className="captcha-row">
        {challenge && (
          <div className="captcha-challenge">
            {challenge}
          </div>
        )}
        <button 
          type="button" 
          className="captcha-refresh" 
          onClick={load} 
          title="Get a new challenge"
        >
          &#8635;
        </button>
      </div>
      <input
        id="captcha-input"
        type="text"
        placeholder="Enter the answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        autoComplete="off"
        required
      />
      {error && <p className="captcha-error">{error}</p>}
    </div>
  );
});

export default Captcha;