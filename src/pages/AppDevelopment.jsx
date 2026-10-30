import React, { useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import ServiceDescription from '../components/ServiceDescription';
import { SERVICE_DOCS } from '../data/serviceDocs';
import '../styles/site-base.css';
import ServicePlanPanel from '../components/ServicePlanPanel';
import useServiceTiers from '../lib/useServiceTiers';
import '../styles/app.css';
import { submitInquiry, fieldValue, fieldChecked, successText } from '../lib/inquiry';

// Converted from e8954424-app-development.php (PHP). Markup and classes are unchanged.
const AppDevelopment = () => {
  useSiteStyles();
  // Prices come from the database (service_tiers)
  const { tiers: app } = useServiceTiers('application');
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await submitInquiry('app-development', {
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
      <div className="ayinde-site app-page">
        {/* App Development Specific CSS */}
        {/* === Hero Split Section (Plans + Form) === */}
        <section className="hero-split">
          <div className="container z-3">
            <div className="row g-5 align-items-start">
              {/* Left Side: Copy & Pricing Summary */}
              <div className="col-lg-6 pt-lg-4">
                <span className="badge-custom badge-orange bg-white border border-light shadow-sm mb-3">
                  <i className="fa-solid fa-mobile-screen-button me-2" /> APP ENGINEERING
                </span>
                <h1 className="display-font mb-3" style={{color: 'var(--color-navy)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: '1.1'}}>{SERVICE_DOCS.app.headline}</h1>
                <p className="text-muted mb-4" style={{fontSize: '1.1rem', maxWidth: 500}}>
                  From rapid prototypes to native enterprise ecosystems. Choose your tier, submit your brief, and our engineers will begin mapping your application architecture immediately.
                </p>
                {/* 2x2 Pricing Grid */}
                <div className="pricing-grid">
                  {/* MVP / Prototype */}
                  <div className="price-card-mini">
                    <h4 className="plan-title-mini" style={{color: 'var(--color-navy)'}}>MVP / Prototype</h4>
                    <div className="plan-price-mini">{money(app.starter.basePrice)}<small>/mo</small></div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Core Feature Build</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Single Platform / Web-App</li>
                      <li><i className="fa-solid fa-check text-info me-2" />4-6 Weeks Delivery</li>
                    </ul>
                  </div>
                  {/* Cross-Platform */}
                  <div className="price-card-mini">
                    <h4 className="plan-title-mini" style={{color: 'var(--color-navy)'}}>Cross-Platform</h4>
                    <div className="plan-price-mini">{money(app.professional.basePrice)}<small>/mo</small></div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />iOS &amp; Android Ready</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />API Integrations</li>
                      <li><i className="fa-solid fa-check text-info me-2" />8-12 Weeks Delivery</li>
                    </ul>
                  </div>
                  {/* Native (Highlighted) */}
                  <div className="price-card-mini highlight">
                    <div className="popular-badge">PREMIUM</div>
                    <h4 className="plan-title-mini text-white">Advanced Native</h4>
                    <div className="plan-price-mini">{money(app.advanced.basePrice)}<small>/mo</small></div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-warning me-2" />Swift (iOS) / Kotlin (Android)</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-warning me-2" />Complex UI/UX Animations</li>
                      <li><i className="fa-solid fa-check text-warning me-2" />12-16 Weeks Delivery</li>
                    </ul>
                  </div>
                  {/* Enterprise */}
                  <div className="price-card-mini">
                    <h4 className="plan-title-mini" style={{color: 'var(--color-navy)'}}>Custom Enterprise</h4>
                    <div className="plan-price-mini" style={{fontSize: '1.4rem', color: 'var(--color-navy)'}}>Let's Talk</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />IoT &amp; AI Integration</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Admin Dashboard + APIs</li>
                      <li><i className="fa-solid fa-check text-info me-2" />Timeline TBD</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Right Side: Floating Label Form */}
              <div className="col-lg-6">
                <div className="hero-form-wrapper">
                  <ServicePlanPanel serviceKey="application" />
                  <div id="formContainer">
                    <h3 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>App Requirements</h3>
                    <p className="text-muted small mb-4">Secure your spot in our app development queue.</p>
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
                              <option value disabled selected>Select your preferred development tier...</option>
                              <option value="MVP">{`MVP / Prototype (${money(app.starter.basePrice)}/mo)`}</option>
                              <option value="CrossPlatform">{`Cross-Platform App (${money(app.professional.basePrice)}/mo)`}</option>
                              <option value="Native">{`Advanced Native App (${money(app.advanced.basePrice)}/mo)`}</option>
                              <option value="Enterprise">Custom Enterprise Ecosystem (custom quote)</option>
                            </select>
                            <label htmlFor="planSelect">Select Service Tier</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea className="form-control" id="projDesc" placeholder="Describe your app idea" required defaultValue={""} />
                            <label htmlFor="projDesc">App Idea &amp; Core Features Needed</label>
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
                                Activate Priority Setup &amp; Wireframing
                              </div>
                              <div className="text-muted small mt-1 mb-2">
                                Skip the queue. Processing your upfront commitment fee guarantees immediate UI/UX wireframing and priority architectural review. Fully refundable if scope isn't agreed upon.
                              </div>
                              {/* This span dynamically changes based on select dropdown */}
                              
                            </div>
                          </label>
                        </div>
                        <div className="col-12 mt-4">
                          <button type="submit" disabled={submitting} className="btn-primary-custom w-100 justify-content-center py-3" id="submitBtn" style={{fontSize: 16}}>
                            Submit App Inquiry
                          </button>
                        </div>
                      </div>
                  {status && (
                    <div className={`alert ${status.ok ? 'alert-success' : 'alert-danger'} mt-3 mb-0 small`} role="status">{status.text}</div>
                  )}
                                      </form>
                  </div>
                  {/* Payment Loader */}
                  <div className="payment-loader" id="paymentLoader">
                    <div className="spinner-border mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="display-font text-navy">Securing Payment Gateway...</h4>
                    <p className="text-muted small">Redirecting to Stripe to process <strong id="loaderPriceText" className="text-navy" />.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ServiceDescription doc={SERVICE_DOCS.app} />
        {/* === Footer === */}
      </div>
      
    </>
  );
};

export default AppDevelopment;