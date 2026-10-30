import React, { useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import ServiceDescription from '../components/ServiceDescription';
import { SERVICE_DOCS } from '../data/serviceDocs';
import '../styles/site-base.css';
import ServicePlanPanel from '../components/ServicePlanPanel';
import useServiceTiers from '../lib/useServiceTiers';
import '../styles/consulting.css';
import { submitInquiry, fieldValue, fieldChecked, successText } from '../lib/inquiry';

// Converted from 89646044-tech-consulting.php (PHP). Markup and classes are unchanged.
const TechConsulting = () => {
  // Hourly rates come from the database (service_tiers)
  const { tiers: cons } = useServiceTiers('consultation');

  useSiteStyles();
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await submitInquiry('tech-consultancy', {
        first_name: fieldValue(f, 'fName'),
        last_name: fieldValue(f, 'lName'),
        email: fieldValue(f, 'emailAdd'),
        phone: fieldValue(f, 'phoneNum'),
        plan: fieldValue(f, 'planSelect'),
        description: fieldValue(f, 'projDesc'),
        priority_checkout: fieldChecked(f, 'priorityCheckout'),
      });
      setStatus({ ok: true, text: successText(res) });
      f.reset();
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="ayinde-site consulting-page">
        {/* Tech Consulting Specific CSS */}
        {/* === Hero Split Section (Plans + Form) === */}
        <section className="hero-split">
          <div className="container z-3">
            <div className="row g-5 align-items-start">
              {/* Left Side: Copy & Pricing Summary */}
              <div className="col-lg-6 pt-lg-2">
                <span className="badge-custom badge-navy bg-white border border-light shadow-sm mb-3">
                  <i className="fa-solid fa-network-wired me-2" /> STRATEGY &amp; ADVICE
                </span>
                <h1 className="display-font mb-3" style={{color: 'var(--color-navy)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: '1.1'}}>{SERVICE_DOCS.consulting.headline}</h1>
                <p className="text-muted mb-4" style={{fontSize: '1.05rem', maxWidth: 500}}>
                  Whether you need quick expert advice or an in-depth enterprise implementation roadmap, our consultants are ready to guide your technology decisions.
                </p>
                {/* Pricing Stack */}
                <div className="pricing-stack">
                  {/* Starter Consultation */}
                  <div className="price-card-row">
                    <div className="price-card-left">
                      <h4 className="plan-title-mini" style={{color: '#00c853'}}>Starter</h4>
                      <p className="text-muted plan-desc-mini">Perfect for initial discovery &amp; quick advice</p>
                      <div className="plan-price-mini">${cons.starter.hourlyRate}</div>
                      <div className="plan-price-sub text-muted">Per Hour <br /> <span className="small">(Minimum: 1 Hour)</span></div>
                    </div>
                    <div className="price-card-right">
                      <div className="fw-bold small mb-2 text-navy">What's Included:</div>
                      <ul className="feature-list text-muted">
                        <li><i className="fa-solid fa-check me-2" style={{color: '#00c853'}} />1-hour focused session</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: '#00c853'}} />Initial discovery &amp; assessment</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: '#00c853'}} />Quick expert advice</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: '#00c853'}} />Basic recommendations</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: '#00c853'}} />Q&amp;A session</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: '#00c853'}} />Email follow-up</li>
                      </ul>
                    </div>
                  </div>
                  {/* Standard Consultation */}
                  <div className="price-card-row">
                    <div className="price-card-left">
                      <h4 className="plan-title-mini" style={{color: 'var(--color-blue)'}}>Standard</h4>
                      <p className="text-muted plan-desc-mini">Ideal for small projects &amp; quick advice</p>
                      <div className="plan-price-mini">${cons.standard.hourlyRate}</div>
                      <div className="plan-price-sub text-muted">Per Hour <br /> <span className="small">(Minimum: 3 Hours)</span></div>
                    </div>
                    <div className="price-card-right">
                      <div className="fw-bold small mb-2 text-navy">What's Included:</div>
                      <ul className="feature-list text-muted">
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-blue)'}} />One-on-one consultation</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-blue)'}} />Strategy &amp; advice</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-blue)'}} />Up to 3 hours per session</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-blue)'}} />Email support</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-blue)'}} />Solutions &amp; recommendations</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-blue)'}} />Project roadmap (basic)</li>
                      </ul>
                    </div>
                  </div>
                  {/* Enterprise Consultation */}
                  <div className="price-card-row highlight">
                    <div className="popular-badge">PREMIUM</div>
                    <div className="price-card-left">
                      <h4 className="plan-title-mini" style={{color: 'var(--color-orange)'}}>Enterprise</h4>
                      <p className="plan-desc-mini text-white-50">For comprehensive projects &amp; in-depth analysis</p>
                      <div className="plan-price-mini text-orange">${cons.enterprise.hourlyRate}</div>
                      <div className="plan-price-sub text-white-50">Per Hour <br /> <span className="small">(Minimum: 10 Hours)</span></div>
                    </div>
                    <div className="price-card-right">
                      <div className="fw-bold small mb-2 text-white">What's Included:</div>
                      <ul className="feature-list text-white-50">
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Dedicated consultant</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Deep-dive strategy sessions</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Minimum 10 hours</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Priority email &amp; phone support</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Detailed recommendations report</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Implementation roadmap</li>
                        <li><i className="fa-solid fa-check me-2" style={{color: 'var(--color-orange)'}} />Weekly check-ins</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Side: Floating Label Form */}
              <div className="col-lg-6">
                <div className="hero-form-wrapper">
                  <ServicePlanPanel serviceKey="consultation" />
                  <div id="formContainer">
                    <h3 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>Book a Consultation</h3>
                    <p className="text-muted small mb-4">Select your tier to secure time with our engineers.</p>
                    <form onSubmit={handleFormSubmit} id="projectForm">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="fName" placeholder="First Name" required />
                            <label htmlFor="fName">First Name</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="lName" placeholder="Last Name" required />
                            <label htmlFor="lName">Last Name</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input type="email" className="form-control" id="emailAdd" placeholder="name@example.com" required />
                            <label htmlFor="emailAdd">Email Address</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input type="tel" className="form-control" id="phoneNum" placeholder="Phone" />
                            <label htmlFor="phoneNum">Phone Number</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <select className="form-select" id="planSelect" required>
                              <option value disabled selected>Select your consulting tier...</option>
                              <option value="Starter">{`Starter Consultation ($${cons.starter.hourlyRate}/hr - ${cons.starter.minHours} hr min)`}</option>
                              <option value="Standard">{`Standard Consultation ($${cons.standard.hourlyRate}/hr - ${cons.standard.minHours} hrs min)`}</option>
                              <option value="Enterprise">{`Enterprise Consultation ($${cons.enterprise.hourlyRate}/hr - ${cons.enterprise.minHours} hrs min)`}</option>
                            </select>
                            <label htmlFor="planSelect">Consultation Tier</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea className="form-control" id="projDesc" placeholder="Consultation topics" required defaultValue={""} />
                            <label htmlFor="projDesc">Key Topics &amp; Questions to Discuss</label>
                          </div>
                        </div>
                        {/* Dynamic Priority Payment Box */}
                        <div className="col-12">
                          <label className="payment-toggle-box d-flex align-items-start gap-3 w-100" id="paymentBox">
                            <div className="form-check mt-1">
                              <input className="form-check-input" type="checkbox" id="priorityCheckout" style={{transform: 'scale(1.3)'}} />
                            </div>
                            <div>
                              <div className="fw-bold" style={{color: 'var(--color-navy)', fontSize: 16}}>
                                Pay Minimum Commitment Retainer
                              </div>
                              <div className="text-muted small mt-1 mb-2">
                                Processing your retainer guarantees your spot on our calendar. The total due reflects the required minimum hours for your selected tier.
                              </div>
                              {/* This span dynamically changes based on select dropdown */}
                              
                            </div>
                          </label>
                        </div>
                        <div className="col-12 mt-4">
                          <button type="submit" disabled={submitting} className="btn-primary-custom w-100 justify-content-center py-3" id="submitBtn" style={{fontSize: 16}}>
                            Request Booking
                          </button>
                        </div>
                      </div>
                  {status && (
                    <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'} mt-3 mb-0 small`} role="status">{status.text}</div>
                  )}
                                      </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ServiceDescription doc={SERVICE_DOCS.consulting} />
        {/* === Footer === */}
      </div>
      
    </>
  );
};

export default TechConsulting;