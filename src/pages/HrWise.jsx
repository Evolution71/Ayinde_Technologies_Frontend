import React, { useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/hr-wise.css';

// Converted from cfcd9be2-hr-wise.php (PHP). Markup and classes are unchanged.
const HrWise = () => {
  useSiteStyles();
  const handleFormSubmit = (e) => {
    // Simulated submit, as in the PHP source. Wire to the backend when ready.
    e.preventDefault();
  };

  const GALLERY = [
  {
    "src": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
    "title": "HR Administrator Dashboard"
  },
  {
    "src": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    "title": "Applicant Pipeline & Tracking"
  },
  {
    "src": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    "title": "Automated Team Onboarding"
  },
  {
    "src": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    "title": "Performance & OKR Reviews"
  },
  {
    "src": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    "title": "Digital Compliance & Contracts"
  },
  {
    "src": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    "title": "Employee Self-Service Portal"
  }
];
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="ayinde-site hr-wise-page">
        <div>
          {/* HR-Wise Specific CSS */}
          {/* === Page Header === */}
          <header className="product-hero">
            <div className="container position-relative z-3 text-center">
              <span className="badge-custom bg-white text-navy border border-light mb-4 shadow-sm">
                <i className="fa-solid text-dark fa-users-gear text-info me-2" /> <span className="text-dark">HR-WISE</span>
              </span>
              <h1 className="display-font text-white mb-4" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Smarter Human Resources.</h1>
              <p className="lead text-white-50 mx-auto mb-5" style={{maxWidth: 700, fontSize: '1.1rem', lineHeight: '1.6'}}>
                Streamline your workforce management with a platform built for modern US businesses. Manage applicant tracking, automated onboarding, compliance documentation, and employee performance seamlessly.
              </p>
              <a href="#subscriptionForm" className="btn-primary-custom px-5 py-3">Start Free Trial <i className="fa-solid fa-arrow-down ms-2" /></a>
            </div>
          </header>
          {/* === Detailed Features === */}
          <section className="py-5 bg-white border-bottom">
            <div className="container py-4">
              <div className="row g-5">
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-file-signature" /></div>
                  <h5 className="fw-bold text-navy">W-4 &amp; I-9 Compliance</h5>
                  <p className="text-muted small">Digitize and securely store essential tax and employment verification forms to ensure your business remains audit-ready.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-magnifying-glass-chart" /></div>
                  <h5 className="fw-bold text-navy">Applicant Tracking</h5>
                  <p className="text-muted small">Post jobs, parse resumes, and build customized interview pipelines to find the perfect talent faster.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-handshake-angle" /></div>
                  <h5 className="fw-bold text-navy">Automated Onboarding</h5>
                  <p className="text-muted small">Send welcome packets, assign training modules, and provision software access automatically before day one.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-ranking-star" /></div>
                  <h5 className="fw-bold text-navy">Performance Appraisals</h5>
                  <p className="text-muted small">Track OKRs, manage 360-degree feedback, and schedule continuous review cycles directly from the portal.</p>
                </div>
              </div>
            </div>
          </section>
          {/* === Interface Gallery === */}
          <section className="py-5 bg-light">
            <div className="container py-4">
              <div className="text-center mb-5">
                <h2 className="display-font text-navy">Inside HR-Wise</h2>
                <p className="text-muted">Explore the intuitive portals designed for both administrators and employees.</p>
              </div>
              <div className="row g-4">
                {/* Gallery Images */}
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
                        <h2 className="display-font text-navy">Get HR-Wise</h2>
                        <p className="text-muted small">Choose your subscription plan or request our team to contact you for a customized demo.</p>
                      </div>
                      <form onSubmit={handleFormSubmit} id="hrForm">
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
                                <option value="Monthly">Monthly Billing ($49/mo)</option>
                                <option value="Quarterly">Quarterly Billing ($139/qtr)</option>
                                <option value="BiAnnually">Bi-Annual Billing ($269/half-year)</option>
                                <option value="Annually">Annual Billing ($499/yr - Save 15%)</option>
                              </select>
                              <label htmlFor="planSelect">Subscription Plan</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-floating">
                              <input type="number" className="form-control" id="employeeCount" placeholder={0} required />
                              <label htmlFor="employeeCount">Number of Current Employees</label>
                            </div>
                          </div>
                          {/* Dynamic Checkout Button Area */}
                          <div className="col-12 mt-4 text-center">
                            <div id="priceDisplayBox" className="mb-3 badge bg-navy text-white px-4 py-2 rounded-pill fs-6">
                              Total Due: <span id="displayAmount">$0.00</span>
                            </div>
                            <button type="submit" className="btn-primary-custom w-100 py-3" id="submitActionBtn" style={{fontSize: 16}}>
                              Proceed to Secure Checkout
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    {/* Payment Loader */}
                    <div className="payment-loader" id="paymentLoaderBox">
                      <div className="spinner-border mb-3" style={{color: 'var(--color-blue)'}} role="status" />
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

export default HrWise;
