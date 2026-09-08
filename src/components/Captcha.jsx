import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { api } from '../api';

/**
 * Captcha widget. Exposes `getToken()` and `getAnswer()` via ref so parent
 * forms can read the current challenge when submitting, and `refresh()` to
 * pull a new one (used after a failed submission).
 */
const Captcha = forwardRef(function Captcha(_props, ref) {
  const [token, setToken] = useState(null);
  const [image, setImage] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await api.getCaptcha();
      setToken(data.token);
      setImage(data.image);
      setAnswer('');
      setError('');
    } catch (e) {
      setError("Couldn't load the captcha — is the backend running?");
    }
  }

  useEffect(() => { load(); }, []);

  useImperativeHandle(ref, () => ({
    getToken: () => token,
    getAnswer: () => answer,
    refresh: load,
  }));

  return (
    <div className="captcha-widget">
      <label htmlFor="captcha-input">Type the code shown</label>
      <div className="captcha-row">
        {image && <img src={image} alt="Captcha challenge" className="captcha-image" />}
        <button type="button" className="captcha-refresh" onClick={load} title="Get a new code">
          &#8635;
        </button>
      </div>
      <input
        id="captcha-input"
        type="text"
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
