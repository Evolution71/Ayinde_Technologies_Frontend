import React from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/website.css';

// Converted from 84d7bf77-website-development.php (PHP). Markup and classes are unchanged.
const WebsiteDevelopment = () => {
  useSiteStyles();
  const handleFormSubmit = (e) => {
    // Simulated submit, as in the PHP source. Wire to the backend when ready.
    e.preventDefault();
  };

  return (
    <>
      <div className="ayinde-site">
        {/* Website Development Specific CSS */}
        {/* === Hero Split Section (Plans + Form) === */}
        <section className="hero-split">
          <div className="container z-3">
            <div className="row g-5 align-items-start">
              {/* Left Side: Copy & Pricing Summary */}
              <div className="col-lg-6 pt-lg-4">
                <span className="badge-custom badge-blue bg-white border border-light shadow-sm mb-3">
                  <i className="fa-solid fa-code me-2" /> WEB ENGINEERING
                </span>
                <h1 className="display-font mb-3" style={{color: 'var(--color-navy)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: '1.1'}}>
                  Build highly scalable web ecosystems.
                </h1>
                <p className="text-muted mb-4" style={{fontSize: '1.1rem', maxWidth: 500}}>
                  Select a tier that fits your roadmap. Once submitted, our engineers will review your request and initialize project onboarding immediately.
                </p>
                {/* 2x2 Pricing Grid */}
                <div className="pricing-grid">
                  {/* Basic */}
                  <div className="price-card-mini">
                    <h4 className="plan-title-mini" style={{color: 'var(--color-navy)'}}>Basic</h4>
                    <div className="plan-price-mini">$1,200</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />1-5 Pages Responsive</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Standard CMS</li>
                      <li><i className="fa-solid fa-check text-info me-2" />2-3 Weeks Delivery</li>
                    </ul>
                  </div>
                  {/* Intermediate */}
                  <div className="price-card-mini">
                    <h4 className="plan-title-mini" style={{color: 'var(--color-navy)'}}>Intermediate</h4>
                    <div className="plan-price-mini">$3,500</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Up to 15 Pages</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Basic E-Commerce</li>
                      <li><i className="fa-solid fa-check text-info me-2" />4-6 Weeks Delivery</li>
                    </ul>
                  </div>
                  {/* Advanced (Highlighted) */}
                  <div className="price-card-mini highlight">
                    <div className="popular-badge">POPULAR</div>
                    <h4 className="plan-title-mini text-white">Advanced</h4>
                    <div className="plan-price-mini">$7,800</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-warning me-2" />Unlimited Scaling</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-warning me-2" />Full E-Commerce</li>
                      <li><i className="fa-solid fa-check text-warning me-2" />8-12 Weeks Delivery</li>
                    </ul>
                  </div>
                  {/* Custom */}
                  <div className="price-card-mini">
                    <h4 className="plan-title-mini" style={{color: 'var(--color-navy)'}}>Custom/Enterprise</h4>
                    <div className="plan-price-mini" style={{fontSize: '1.4rem'}}>Let's Talk</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Dedicated Team</li>
                      <li className="mb-1"><i className="fa-solid fa-check text-info me-2" />Custom API/AI</li>
                      <li><i className="fa-solid fa-check text-info me-2" />Timeline TBD</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Right Side: Floating Label Form */}
              <div className="col-lg-6">
                <div className="hero-form-wrapper">
                  <div id="formContainer">
                    <h3 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>Project Inquiry</h3>
                    <p className="text-muted small mb-4">Secure your spot in our development queue today.</p>
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
                              <option value disabled selected>Select your preferred tier...</option>
                              <option value="Basic">Basic Web Development ($1,200)</option>
                              <option value="Intermediate">Intermediate Web Development ($3,500)</option>
                              <option value="Advanced">Advanced Web Development ($7,800)</option>
                              <option value="Custom">Custom Enterprise Build (Requires $500 Deposit)</option>
                            </select>
                            <label htmlFor="planSelect">Select Service Tier</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea className="form-control" id="projDesc" placeholder="Describe your project" required defaultValue={""} />
                            <label htmlFor="projDesc">Project Description &amp; Goals</label>
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
                                Activate Priority Project Setup
                              </div>
                              <div className="text-muted small mt-1 mb-2">
                                Skip the queue. Processing your upfront payment guarantees immediate engineer assignment and priority support.
                              </div>
                              {/* This span dynamically changes based on select dropdown */}
                              <div className="badge bg-navy text-white px-3 py-2 rounded-pill" style={{fontSize: 13}}>
                                <i className="fa-solid fa-credit-card me-2" /> Amount Due: <span id="dynamicPriceDisplay">$0.00</span>
                              </div>
                            </div>
                          </label>
                        </div>
                        <div className="col-12 mt-4">
                          <button type="submit" className="btn-primary-custom w-100 justify-content-center py-3" id="submitBtn" style={{fontSize: 16}}>
                            Submit Inquiry
                          </button>
                        </div>
                      </div>
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
        {/* === Footer === */}
      </div>
      
    </>
  );
};

export default WebsiteDevelopment;
