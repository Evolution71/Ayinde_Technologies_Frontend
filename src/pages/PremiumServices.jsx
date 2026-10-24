import React, { useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import ServicePlanPanel from '../components/ServicePlanPanel';
import useServiceTiers from '../lib/useServiceTiers';
import '../styles/premium.css';
import { submitInquiry, fieldValue, fieldChecked, successText } from '../lib/inquiry';

// Converted from 30f1b5cf-premium-services.php (PHP). Markup and classes are unchanged.
const PremiumServices = () => {
  // Prices come from the database (service_tiers)
  const { tiers } = useServiceTiers('premium');
  const base = tiers.supreme.basePrice;
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  useSiteStyles();
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await submitInquiry('premium-services', {
        first_name: fieldValue(f, 'fName'),
        last_name: fieldValue(f, 'lName'),
        email: fieldValue(f, 'emailAdd'),
        phone: fieldValue(f, 'phoneNum'),
        company_name: fieldValue(f, 'companyName'),
        plan: fieldValue(f, 'planSelect'),
        description: fieldValue(f, 'projDesc'),
        priority_checkout: fieldChecked(f, 'priorityCheckout'),
        terms_accepted: fieldChecked(f, 'termsAccepted'),
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
      <div className="ayinde-site premium-page">
        {/* Premium Services Specific CSS */}
        {/* === Hero Split Section === */}
        <section className="hero-split">
          <div className="container z-3">
            <div className="row g-5 align-items-center">
              {/* Left Side: Copy & Value Proposition */}
              <div className="col-lg-6">
                <span className="badge-custom bg-white text-navy border border-light shadow-sm mb-3">
                  <i className="fa-solid fa-crown text-warning me-2" /> <span className="text-dark">PREMIUM ENTERPRISE SUITE</span>
                </span>
                <h1 className="display-font mb-3" style={{fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: '1.1'}}>
                  The Ultimate Digital Ecosystem.
                </h1>
                <p className="text-white-50 mb-4" style={{fontSize: '1.1rem', maxWidth: 500}}>
                  Get a fully synchronized Mobile App, Web Platform, and Desktop Application built exclusively for your business. Subscribe and save with our long-term partnership plans.
                </p>
                {/* Features */}
                <div className="premium-feature-card">
                  <div className="feature-icon-box"><i className="fa-solid fa-cubes" /></div>
                  <div>
                    <h6 className="fw-bold mb-1">The Complete 3-in-1 Suite</h6>
                    <div className="small text-white-50">Web + Mobile (iOS/Android) + Desktop Applications.</div>
                  </div>
                </div>
                <div className="premium-feature-card">
                  <div className="feature-icon-box" style={{background: 'rgba(47, 155, 255, 0.1)', color: 'var(--color-blue)'}}><i className="fa-solid fa-user-tie" /></div>
                  <div>
                    <h6 className="fw-bold mb-1">Dedicated Account Management</h6>
                    <div className="small text-white-50">Direct access to your lead engineer and project manager.</div>
                  </div>
                </div>
                {/* Pricing Summary */}
                <div className="premium-pricing-grid">
                  <div className="savings-card">
                    <div className="small text-white-50 text-uppercase mb-1">Monthly</div>
                    <h4 className="fw-bold text-white mb-0">{money(base)}<span className="fs-6 text-white-50 fw-normal">/mo</span></h4>
                  </div>
                  <div className="savings-card" style={{borderColor: 'rgba(255,122,26,0.3)'}}>
                    <div className="savings-badge">SAVE 5%</div>
                    <div className="small text-white-50 text-uppercase mb-1">Quarterly</div>
                    <h4 className="fw-bold text-white mb-0">{money(base * 0.95)}<span className="fs-6 text-white-50 fw-normal">/mo</span></h4>
                  </div>
                  <div className="savings-card" style={{borderColor: 'rgba(255,122,26,0.5)'}}>
                    <div className="savings-badge">50% DOWN</div>
                    <div className="small text-white-50 text-uppercase mb-1">Then 6 Months</div>
                    <h4 className="fw-bold text-white mb-0">{money(base * 3)}<span className="fs-6 text-white-50 fw-normal"> down</span></h4>
                  </div>
                  <div className="savings-card" style={{borderColor: 'var(--color-orange)'}}>
                    <div className="savings-badge">SAVE 10%</div>
                    <div className="small text-white-50 text-uppercase mb-1">Annually</div>
                    <h4 className="fw-bold text-white mb-0">{money(base * 0.9)}<span className="fs-6 text-white-50 fw-normal">/mo</span></h4>
                  </div>
                </div>
              </div>
              {/* Right Side: Floating Label Form */}
              <div className="col-lg-6">
                <div className="hero-form-wrapper">
                  <ServicePlanPanel serviceKey="premium" />
                  <h3 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>Start Your Subscription</h3>
                  <p className="text-muted small mb-4">Select your billing cycle to initialize your premium suite.</p>
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
                          <input type="text" className="form-control" id="companyName" placeholder="Company" required />
                          <label htmlFor="companyName">Company Name</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <select className="form-select" id="planSelect" required>
                            <option value disabled selected>Choose Billing Cycle...</option>
                            <option value="Monthly">{`Monthly Billing (${money(base)}/mo)`}</option>
                            <option value="Quarterly">{`Quarterly Billing (Save 5% - ${money(base * 3 * 0.95)} total)`}</option>
                            <option value="HalfDown">{`50% Down + 6 Months (${money(base * 3)} now, then ${money(base / 2)}/mo)`}</option>
                            <option value="Annually">{`Annual Billing (Save 10% - ${money(base * 12 * 0.9)} total)`}</option>
                          </select>
                          <label htmlFor="planSelect">Subscription Plan</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea className="form-control" id="projDesc" placeholder="Describe the solution you need" required defaultValue={""} />
                          <label htmlFor="projDesc">What solution are we building for you?</label>
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
                              Initialize Subscription &amp; Project Kickoff
                            </div>
                            <div className="text-muted small mt-1 mb-2">
                              Processing your initial subscription cycle immediately alerts your dedicated project manager to begin onboarding.
                            </div>
                            
                          </div>
                        </label>
                      </div>
                      <div className="col-12 mt-4">
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" id="termsAccepted" required />
                          <label className="form-check-label small" htmlFor="termsAccepted">I accept the Terms and Conditions</label>
                        </div>
                                                <button type="submit" disabled={submitting} className="btn-primary-custom w-100 justify-content-center py-3" id="submitBtn" style={{fontSize: 16, backgroundColor: 'var(--color-navy)', borderColor: 'var(--color-navy)'}}>
                          Request Premium Onboarding
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
        </section>
        {/* === Footer === */}
      </div>
      
    </>
  );
};

export default PremiumServices;