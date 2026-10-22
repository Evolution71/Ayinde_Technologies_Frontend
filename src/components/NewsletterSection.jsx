import React, { useState } from 'react';
import { subscribeNewsletter } from '../lib/inquiry';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await subscribeNewsletter(email.trim());
      setStatus({ ok: true, text: res.message || 'Thanks for subscribing!' });
      setEmail('');
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="newsletter-section p-0 mt-5">
      <div className="container">
        <div className="newsletter-card">
          <div className="row align-items-center position-relative z-1">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <span className="badge-custom badge-orange bg-white bg-opacity-10 border border-light mb-3">
                <span className="rounded-circle bg-warning d-inline-block me-2" style={{width: 8, height: 8}} /> Newsletter
              </span>
              <h2 className="display-font mb-2 text-white">Insights for the Automated Enterprise</h2>
              <p className="text-white-50 mb-0" style={{fontSize: 15}}>Join our mailing list to receive the latest strategies on AI integration, business planning, and automation directly to your inbox.</p>
            </div>
            <div className="col-lg-6">
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    required
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="btn-accent" type="submit" disabled={busy}>
                    {busy ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {status && (
                  <div className={`mt-3 small text-center text-lg-start ${status.ok ? 'text-success' : 'text-warning'}`} role="status">
                    {status.text}
                  </div>
                )}
                <div className="mt-3 text-white-50 small text-center text-lg-start">
                  <i className="fa-solid fa-lock me-1" /> We respect your privacy. Unsubscribe at any time.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
