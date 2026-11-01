import React, { useEffect, useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/about.css';
import NewsletterSection from '../components/NewsletterSection';
import { api } from '../api';

// Initials for the avatar circle, e.g. "Festus Ezuma" -> "FE".
const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
};

// Converted from 3df4fc5f-about.php (PHP). Markup and classes are unchanged.
const About = () => {
  useSiteStyles();

  // Leadership and team come from the database (team_members table)
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    api
      .getTeamMembers()
      .then((res) => {
        if (!live) return;
        const list = Array.isArray(res?.all_members) ? res.all_members : [];
        // Leadership first; the order within each group comes from the database
        const sorted = [...list].sort(
          (a, b) => (a.category === 'leadership' ? 0 : 1) - (b.category === 'leadership' ? 0 : 1)
        );
        setMembers(sorted);
      })
      .catch(() => {
        if (live) setError(true);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <>
      <div className="ayinde-site about-page">
        <div>
          {/* About Page Specific CSS */}
          {/* === Page Header === */}
          <header className="page-header">
            <div className="container position-relative z-3">
              <div className="row">
                <div className="col-lg-8">
                  <span className="badge-custom badge-orange bg-white bg-opacity-10 border border-light mb-4">
                    <span className="rounded-circle bg-warning d-inline-block me-2" style={{width: 8, height: 8}} /> EST. 2026
                  </span>
                  <h1 className="display-font text-white mb-4" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1'}}>We Build The Automated Enterprise.</h1>
                  <p className="lead text-white-50 mb-0" style={{maxWidth: 600, fontSize: '1.1rem', lineHeight: '1.6'}}>
                    Ayinde Technologies Corporation is more than a development agency. We are your strategic technology partner, helping you plan, build, and implement solutions that scale.
                  </p>
                </div>
              </div>
            </div>
          </header>
          {/* === Our Story Section === */}
          <section className="py-5 mt-5">
            <div className="container">
              <div className="row align-items-center g-5">
                <div className="col-lg-6 pe-lg-5">
                  <span className="badge-custom badge-blue mb-3">OUR PHILOSOPHY</span>
                  <h2 className="display-font mb-4" style={{color: 'var(--color-navy)', fontSize: '2.5rem'}}>Plan Before You Build.</h2>
                  <p className="text-muted mb-4" style={{fontSize: '1.05rem', lineHeight: '1.7'}}>
                    Ayinde Technologies Corporation started from a simple observation: most software projects fail not because of bad code, but because of bad planning. We'd rather spend a week on the right business plan than a month building the wrong product.
                  </p>
                  <p className="text-muted mb-5" style={{fontSize: '1.05rem', lineHeight: '1.7'}}>
                    With our dual-coast presence, we provide all-in-one enterprise solutions featuring advanced AI integration, robust architecture, and dedicated account management. We don't just hand over a product and disappear; we stay through the rollout.
                  </p>
                  <div className="d-flex gap-5 border-top pt-4">
                    <div>
                      <h3 className="display-font mb-1" style={{color: 'var(--color-orange)', fontSize: '2rem'}}>100%</h3>
                      <p className="text-muted small fw-bold text-uppercase mb-0" style={{letterSpacing: 1}}>In-House<br />Engineering</p>
                    </div>
                    <div>
                      <h3 className="display-font mb-1" style={{color: 'var(--color-blue)', fontSize: '2rem'}}>24/7</h3>
                      <p className="text-muted small fw-bold text-uppercase mb-0" style={{letterSpacing: 1}}>Enterprise<br />Support</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="about-image-wrapper">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Ayinde Team Collaboration" className="img-fluid w-100" style={{objectFit: 'cover', height: 550}} />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Core Values Section === */}
          <section className="py-5 my-5 bg-light" style={{borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
            <div className="container py-4">
              <div className="text-center mb-5 pb-2">
                <h2 className="display-font" style={{color: 'var(--color-navy)', fontSize: '2.5rem'}}>The Ayinde Advantage</h2>
                <p className="text-muted mx-auto" style={{maxWidth: 600}}>What sets us apart in the technology landscape.</p>
              </div>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="feature-card">
                    <div className="feature-number" style={{color: 'var(--color-blue)', background: 'rgba(47,155,255,0.1)'}}>01</div>
                    <h4 className="display-font mb-3" style={{color: 'var(--color-navy)'}}>Strategic Insight</h4>
                    <p className="text-muted small mb-0">We sit down with a business plan before touching a keyboard, ensuring every line of code aligns perfectly with your bottom line.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card">
                    <div className="feature-number" style={{color: 'var(--color-orange)', background: 'rgba(255,122,26,0.1)'}}>02</div>
                    <h4 className="display-font mb-3" style={{color: 'var(--color-navy)'}}>AI-First Approach</h4>
                    <p className="text-muted small mb-0">From predictive analytics to automated customer service, we integrate cutting-edge AI to future-proof your daily operations.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card">
                    <div className="feature-number" style={{color: 'var(--color-navy)', background: 'rgba(10,34,72,0.1)'}}>03</div>
                    <h4 className="display-font mb-3" style={{color: 'var(--color-navy)'}}>Coast-to-Coast</h4>
                    <p className="text-muted small mb-0">With our East Coast HQ in Delaware and West Coast Lab in California, we provide seamless, round-the-clock coverage.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Leadership and Team (from the database, initials only, no photos) === */}
          <section className="py-5 mb-5">
            <div className="container">
              {/* Header */}
              <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                  <span className="badge-custom badge-navy mb-3">LEADERSHIP</span>
                  <h2 className="display-font" style={{color: 'var(--color-navy)', fontSize: '2.5rem'}}>Driven by Innovation</h2>
                  <p className="text-muted">Meet the visionary minds steering Ayinde Technologies Corporation into the future of enterprise automation.</p>
                </div>
              </div>

              {loading && <p className="text-center text-muted">Loading team members...</p>}
              {!loading && error && <p className="text-center" style={{color: '#d32f2f'}}>We could not load the team right now. Please refresh the page.</p>}
              {!loading && !error && members.length === 0 && (
                <p className="text-center text-muted">Team members will appear here once added.</p>
              )}

              {/* Team Grid */}
              <div className="row g-4">
                {members.map((m) => (
                  <div className="col-sm-6 col-lg-3" key={m.id}>
                    <div
                      className="h-100 text-center bg-white rounded-4 p-4"
                      style={{boxShadow: '0 16px 40px rgba(10,34,72,0.08)'}}
                    >
                      <div
                        aria-hidden="true"
                        className="d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{width: 96, height: 96, borderRadius: '50%', background: '#0A2248', color: '#fff', fontSize: 30, fontWeight: 700, letterSpacing: 1}}
                      >
                        {initialsOf(m.name)}
                      </div>
                      <h3 className="display-font h5 mb-1" style={{color: 'var(--color-navy)'}}>{m.name}</h3>
                      {m.title && (
                        <p className="small fw-bold mb-2" style={{color: 'var(--color-blue)', letterSpacing: '0.5px'}}>{m.title}</p>
                      )}
                      {m.quote && (
                        <p className="text-muted small fst-italic mb-2" style={{lineHeight: 1.6}}>"{m.quote}"</p>
                      )}
                      {m.linkedin_url && (
                        <a
                          href={m.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name} on LinkedIn`}
                          className="btn btn-outline-primary btn-sm mt-2"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* === Newsletter Section === */}
          <NewsletterSection />
        </div>
      </div>

    </>
  );
};

export default About;
