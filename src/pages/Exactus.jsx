import React, { useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/exactus.css';

// Converted from 78d6e62e-exactus.php (PHP). Markup and classes are unchanged.
const Exactus = () => {
  useSiteStyles();
  const handleFormSubmit = (e) => {
    // Simulated submit, as in the PHP source. Wire to the backend when ready.
    e.preventDefault();
  };

  const GALLERY = [
  {
    "src": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    "title": "Financial Overview Dashboard"
  },
  {
    "src": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    "title": "One-Click Payroll Run"
  },
  {
    "src": "https://images.unsplash.com/photo-1554224154-26032ffc0d04?auto=format&fit=crop&w=600&q=80",
    "title": "Tax Withholding & Compliance"
  },
  {
    "src": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    "title": "Direct Deposit Management"
  },
  {
    "src": "https://images.unsplash.com/photo-1435527173128-983b87201f4d?auto=format&fit=crop&w=600&q=80",
    "title": "Employee Time Tracking"
  },
  {
    "src": "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=600&q=80",
    "title": "General Ledger Reports"
  }
];
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="ayinde-site exactus-page">
        <div>
          {/* Exactus Specific CSS */}
          {/* === Page Header === */}
          <header className="product-hero">
            <div className="container position-relative z-3 text-center">
              <span className="badge-custom bg-white text-navy border border-light mb-4 shadow-sm">
                <i className="fa-solid text-dark fa-file-invoice-dollar text-orange me-2" /> <span className="text-dark">EXACTUS</span>
              </span>
              <h1 className="display-font text-white mb-4" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Flawless Payroll &amp; Accounting.</h1>
              <p className="lead text-white-50 mx-auto mb-5" style={{maxWidth: 700, fontSize: '1.1rem', lineHeight: '1.6'}}>
                Remove the headache from payday. Exactus is an IRS-compliant software that automates state and federal tax calculations, manages direct deposits, and tracks overtime flawlessly for US SMEs.
              </p>
              <a href="#subscriptionForm" className="btn-primary-custom px-5 py-3" style={{backgroundColor: 'var(--color-orange)', borderColor: 'var(--color-orange)'}}>Start Free Trial <i className="fa-solid fa-arrow-down ms-2" /></a>
            </div>
          </header>
          {/* === Detailed Features === */}
          <section className="py-5 bg-white border-bottom">
            <div className="container py-4">
              <div className="row g-5">
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-scale-balanced" /></div>
                  <h5 className="fw-bold text-navy">IRS Compliance</h5>
                  <p className="text-muted small">Automate federal, state, and local tax withholdings. Seamlessly generate W-2s and 1099s at year-end.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-building-columns" /></div>
                  <h5 className="fw-bold text-navy">US Direct Deposits</h5>
                  <p className="text-muted small">Execute secure, next-day ACH direct deposits to your employees' bank accounts without hidden fees.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-stopwatch" /></div>
                  <h5 className="fw-bold text-navy">Time &amp; PTO Tracking</h5>
                  <p className="text-muted small">Automatically calculate overtime (1.5x) and track Paid Time Off balances directly within the payroll run.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-book" /></div>
                  <h5 className="fw-bold text-navy">General Ledger Sync</h5>
                  <p className="text-muted small">Export your payroll data directly into QuickBooks, Xero, or your custom ERP with a single click.</p>
                </div>
              </div>
            </div>
          </section>
          {/* === Interface Gallery === */}
          <section className="py-5 bg-light">
            <div className="container py-4">
              <div className="text-center mb-5">
                <h2 className="display-font text-navy">Inside Exactus</h2>
                <p className="text-muted">Explore the intuitive financial dashboard designed to prevent costly payroll errors.</p>
              </div>
              <div className="row g-4">
                {/* Gallery Images (Updated Links) */}
                {GALLERY.map((img) => (
                      <div className="col-lg-4 col-md-6" key={img.title}>
                        <div className="gallery-item" tabIndex={0} onClick={() => setLightbox(img)}>
                          <img src={img.src} alt={img.title} />
                          <div className="gallery-overlay">
                            <div className="gallery-icon"><i className="fa-solid fa-magnifying-glass-plus"></i></div>
                            <h6 className="fw-bold mb-0 text-center px-3">{img.title}</h6>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </section>
          {/* Bootstrap Modal for Gallery */}
          {/* === Subscription & Inquiry Form === */}
          <section className="py-5" id="subscriptionForm">
            <div className="container py-4">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="hero-form-wrapper">
                    <div id="formContentBox">
                      <div className="text-center mb-4">
                        <h2 className="display-font text-navy">Get Exactus</h2>
                        <p className="text-muted small">Choose your subscription plan or request our team to contact you for a demo.</p>
                      </div>
                      <form onSubmit={handleFormSubmit} id="exactusForm">
                        {/* Intent Toggle */}
                        <div className="intent-toggle-wrapper">
                          <div className="intent-btn active" id="btnPayNow">
                            <i className="fa-solid fa-credit-card me-2" /> Subscribe &amp; Pay Now
                          </div>
                          <div className="intent-btn" id="btnIndicate">
                            <i className="fa-solid fa-headset me-2" /> Indicate Interest / Demo
                          </div>
                        </div>
                        <input type="hidden" id="userIntent" defaultValue="pay" />
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input type="text" className="form-control" id="fName" required />
                              <label htmlFor="fName">First Name</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input type="text" className="form-control" id="lName" required />
                              <label htmlFor="lName">Last Name</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input type="email" className="form-control" id="emailAdd" required />
                              <label htmlFor="emailAdd">Corporate Email</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input type="text" className="form-control" id="company" required />
                              <label htmlFor="company">Company Name</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-floating">
                              <select className="form-select" id="planSelect" required>
                                <option value disabled selected>Select Billing Cycle...</option>
                                <option value="Monthly">Monthly Billing ($99/mo)</option>
                                <option value="Quarterly">Quarterly Billing ($285/qtr)</option>
                                <option value="BiAnnually">Bi-Annual Billing ($549/half-year)</option>
                                <option value="Annually">Annual Billing ($999/yr - Save 15%)</option>
                              </select>
                              <label htmlFor="planSelect">Subscription Plan</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-floating">
                              <input type="number" className="form-control" id="employeeCount" placeholder={0} required />
                              <label htmlFor="employeeCount">Estimated Number of Employees</label>
                            </div>
                          </div>
                          {/* Dynamic Checkout Button Area */}
                          <div className="col-12 mt-4 text-center">
                            <div id="priceDisplayBox" className="mb-3 badge bg-navy text-white px-4 py-2 rounded-pill fs-6">
                              Total Due: <span id="displayAmount">$0.00</span>
                            </div>
                            <button type="submit" className="btn-primary-custom w-100 py-3" id="submitActionBtn" style={{fontSize: 16, backgroundColor: 'var(--color-orange)', borderColor: 'var(--color-orange)'}}>
                              Proceed to Secure Checkout
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    {/* Payment Loader */}
                    <div className="payment-loader" id="paymentLoaderBox">
                      <div className="spinner-border mb-3" style={{color: 'var(--color-orange)'}} role="status" />
                      <h4 className="display-font text-navy">Connecting to Secure Gateway...</h4>
                      <p className="text-muted small">Redirecting to Stripe to process <strong id="loaderAmount" className="text-navy" />.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Footer === */}
        </div>
      </div>
      
      {lightbox && (
        <div className="modal fade show d-block" style={{ background: 'rgba(10,34,72,0.85)' }} onClick={() => setLightbox(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <img src={lightbox.src} alt={lightbox.title} className="w-100" />
              <div className="p-3 fw-bold text-center">{lightbox.title}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Exactus;
