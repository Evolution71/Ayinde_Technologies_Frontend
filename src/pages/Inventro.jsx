import React, { useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/inventro.css';

// Converted from 8162131f-inventro.php (PHP). Markup and classes are unchanged.
const Inventro = () => {
  useSiteStyles();
  const handleFormSubmit = (e) => {
    // Simulated submit, as in the PHP source. Wire to the backend when ready.
    e.preventDefault();
  };

  const GALLERY = [
  {
    "src": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80",
    "title": "Main Dashboard Overview"
  },
  {
    "src": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    "title": "Analytics & Sales Forecasting"
  },
  {
    "src": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    "title": "Multi-Warehouse Management"
  },
  {
    "src": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    "title": "Vendor & Supplier Portal"
  },
  {
    "src": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
    "title": "Low Stock Alert System"
  },
  {
    "src": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
    "title": "Barcode Scanning Interface"
  }
];
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="ayinde-site inventro-page">
        <div>
          {/* Inventro Specific CSS */}
          {/* === Page Header === */}
          <header className="product-hero">
            <div className="container position-relative z-3 text-center">
              <span className="badge-custom bg-white text-navy border border-light mb-4 shadow-sm">
                <i className="fa-solid text-dark fa-boxes-stacked text-blue me-2" /> <span className="text-dark">INVENTRO</span>
              </span>
              <h1 className="display-font text-white mb-4" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Master Your Supply Chain.</h1>
              <p className="lead text-white-50 mx-auto mb-5" style={{maxWidth: 700, fontSize: '1.1rem', lineHeight: '1.6'}}>
                The ultimate inventory management solution designed for SMEs. Track stock in real-time, automate low-stock alerts, and forecast demand using intelligent algorithms.
              </p>
              <a href="#subscriptionForm" className="btn-primary-custom px-5 py-3">Get Started Today <i className="fa-solid fa-arrow-down ms-2" /></a>
            </div>
          </header>
          {/* === Detailed Features === */}
          <section className="py-5 bg-white border-bottom">
            <div className="container py-4">
              <div className="row g-5">
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-barcode" /></div>
                  <h5 className="fw-bold text-navy">Barcode Scanning</h5>
                  <p className="text-muted small">Instantly update stock levels using built-in camera integration or external barcode scanners.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-bell" /></div>
                  <h5 className="fw-bold text-navy">Automated Alerts</h5>
                  <p className="text-muted small">Never run out of best-sellers. Set custom threshold limits to receive instant low-stock notifications.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-truck-fast" /></div>
                  <h5 className="fw-bold text-navy">Logistics Tracking</h5>
                  <p className="text-muted small">Monitor vendor shipments, track inbound stock, and manage multi-warehouse locations seamlessly.</p>
                </div>
                <div className="col-md-3">
                  <div className="feature-icon-box"><i className="fa-solid fa-chart-pie" /></div>
                  <h5 className="fw-bold text-navy">Predictive Insights</h5>
                  <p className="text-muted small">Analyze historical sales data to forecast future inventory needs and optimize purchasing budgets.</p>
                </div>
              </div>
            </div>
          </section>
          {/* === Interface Gallery === */}
          <section className="py-5 bg-light">
            <div className="container py-4">
              <div className="text-center mb-5">
                <h2 className="display-font text-navy">Inside Inventro</h2>
                <p className="text-muted">A glimpse into the powerful dashboard and operational screens.</p>
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
                        <h2 className="display-font text-navy">Get Inventro</h2>
                        <p className="text-muted small">Choose your subscription plan or request our team to contact you for a demo.</p>
                      </div>
                      <form onSubmit={handleFormSubmit} id="inventroForm">
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
                                <option value="Monthly">Monthly Billing ($59/mo)</option>
                                <option value="Quarterly">Quarterly Billing ($169/qtr)</option>
                                <option value="BiAnnually">Bi-Annual Billing ($319/half-year)</option>
                                <option value="Annually">Annual Billing ($599/yr - Save 15%)</option>
                              </select>
                              <label htmlFor="planSelect">Subscription Plan</label>
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
                      <div className="spinner-border mb-3" role="status" />
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

export default Inventro;
