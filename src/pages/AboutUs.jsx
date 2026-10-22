import React from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/about.css';

// Converted from 3df4fc5f-about.php (PHP). Markup and classes are unchanged.
const About = () => {
  useSiteStyles();
  return (
    <>
      <div className="ayinde-site">
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
                    Ayinde Technologies is more than a development agency. We are your strategic technology partner, helping you plan, build, and implement solutions that scale.
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
                    Ayinde Technologies started from a simple observation: most software projects fail not because of bad code, but because of bad planning. We'd rather spend a week on the right business plan than a month building the wrong product.
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
          {/* === Add this to your existing 
        
        <!-- === Replace your existing Leadership Section with this === */}
          <section className="py-5 mb-5">
            <div className="container">
              {/* Header */}
              <div className="row justify-content-center mb-5">
                <div className="col-lg-8 text-center">
                  <span className="badge-custom badge-navy mb-3">LEADERSHIP</span>
                  <h2 className="display-font" style={{color: 'var(--color-navy)', fontSize: '2.5rem'}}>Driven by Innovation</h2>
                  <p className="text-muted">Meet the visionary minds steering Ayinde Technologies into the future of enterprise automation.</p>
                </div>
              </div>
              {/* Team Grid */}
              <div className="row g-4 align-items-stretch">
                {/* CEO / Founder (Featured Large Column) */}
                <div className="col-lg-5">
                  <div className="team-card-featured text-center mx-auto">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80" alt="Albert A.D. Cabrera" className="rounded-circle shadow-sm mx-auto mb-4" style={{width: 180, height: 180, objectFit: 'cover', border: '5px solid var(--color-light)'}} />
                    <h3 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>Albert A.D. Cabrera</h3>
                    <p className="text-secondary fw-bold small mb-4" style={{letterSpacing: 1, color: 'var(--color-orange) !important'}}>CEO &amp; FOUNDER</p>
                    <p className="text-muted mb-4" style={{fontStyle: 'italic', lineHeight: '1.7', fontSize: 15}}>"Technology should follow a business plan, not replace one. Our mission is to elevate enterprises through smart, scalable, and secure automation."</p>
                    <div className="d-flex justify-content-center gap-3 mt-auto">
                      <a href="/contact" className="social-link" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
                      <a href="mailto:ceo@ayindetech.com" className="social-link" aria-label="Email"><i className="fa-solid fa-envelope" /></a>
                    </div>
                  </div>
                </div>
                {/* Rest of the Leadership Team (2x2 Grid) */}
                <div className="col-lg-7">
                  <div className="row g-4 h-100">
                    {/* CTO */}
                    <div className="col-md-6">
                      <div className="team-card-compact flex-column flex-sm-row text-center text-sm-start">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80" alt="CTO Profile" className="rounded-circle shadow-sm" style={{width: 90, height: 90, objectFit: 'cover', flexShrink: 0}} />
                        <div>
                          <h5 className="display-font mb-1" style={{color: 'var(--color-navy)', fontSize: 18}}>Marcus Chen</h5>
                          <p className="small fw-bold mb-2" style={{color: 'var(--color-blue)', letterSpacing: '0.5px'}}>CHIEF TECHNOLOGY OFFICER</p>
                          <a href="/contact" className="text-muted small text-decoration-none hover-primary"><i className="fa-brands fa-linkedin" /> Connect</a>
                        </div>
                      </div>
                    </div>
                    {/* CAIO */}
                    <div className="col-md-6">
                      <div className="team-card-compact flex-column flex-sm-row text-center text-sm-start">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" alt="CAIO Profile" className="rounded-circle shadow-sm" style={{width: 90, height: 90, objectFit: 'cover', flexShrink: 0}} />
                        <div>
                          <h5 className="display-font mb-1" style={{color: 'var(--color-navy)', fontSize: 18}}>Dr. Sarah Al-Fayed</h5>
                          <p className="small fw-bold mb-2" style={{color: 'var(--color-blue)', letterSpacing: '0.5px'}}>CHIEF AI OFFICER (CAIO)</p>
                          <a href="/contact" className="text-muted small text-decoration-none hover-primary"><i className="fa-brands fa-linkedin" /> Connect</a>
                        </div>
                      </div>
                    </div>
                    {/* Project Manager */}
                    <div className="col-md-6">
                      <div className="team-card-compact flex-column flex-sm-row text-center text-sm-start">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80" alt="Project Manager Profile" className="rounded-circle shadow-sm" style={{width: 90, height: 90, objectFit: 'cover', flexShrink: 0}} />
                        <div>
                          <h5 className="display-font mb-1" style={{color: 'var(--color-navy)', fontSize: 18}}>James Wilson</h5>
                          <p className="small fw-bold mb-2" style={{color: 'var(--color-blue)', letterSpacing: '0.5px'}}>HEAD PROJECT MANAGER</p>
                          <a href="/contact" className="text-muted small text-decoration-none hover-primary"><i className="fa-brands fa-linkedin" /> Connect</a>
                        </div>
                      </div>
                    </div>
                    {/* Human Resources */}
                    <div className="col-md-6">
                      <div className="team-card-compact flex-column flex-sm-row text-center text-sm-start">
                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80" alt="HR Profile" className="rounded-circle shadow-sm" style={{width: 90, height: 90, objectFit: 'cover', flexShrink: 0}} />
                        <div>
                          <h5 className="display-font mb-1" style={{color: 'var(--color-navy)', fontSize: 18}}>Elena Rodriguez</h5>
                          <p className="small fw-bold mb-2" style={{color: 'var(--color-blue)', letterSpacing: '0.5px'}}>DIRECTOR OF HR</p>
                          <a href="/contact" className="text-muted small text-decoration-none hover-primary"><i className="fa-brands fa-linkedin" /> Connect</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Newsletter Section === */}
        </div>
      </div>
      
    </>
  );
};

export default About;