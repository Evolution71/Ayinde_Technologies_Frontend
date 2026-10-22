import React from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/products.css';

// Converted from 5b47bf9e-products.php (PHP). Markup and classes are unchanged.
const Products = () => {
  useSiteStyles();
  return (
    <>
      <div className="ayinde-site">
        <div>
          {/* Products Page Specific CSS */}
          {/* === Page Header === */}
          <header className="products-header text-center">
            <div className="container position-relative z-3">
              <span className="badge-custom bg-white text-navy border border-light mb-4 shadow-sm">
                <i className="fa-solid fa-layer-group text-warning me-2" /> <span className="text-dark">ENTERPRISE SOFTWARE</span> 
              </span>
              <h1 className="display-font text-white mb-3" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Scalable SaaS Solutions.</h1>
              <p className="lead text-white-50 mx-auto mb-0" style={{maxWidth: 700, fontSize: '1.1rem', lineHeight: '1.6'}}>
                Empower your enterprise with our suite of ready-to-deploy software products. Designed for compliance, speed, and seamless daily operations.
              </p>
            </div>
          </header>
          {/* === Products Showcase Section === */}
          <section className="py-5 bg-white" style={{marginTop: '-40px', position: 'relative', zIndex: 10}}>
            <div className="container">
              {/* 1. HR-Wise */}
              <div className="product-showcase-card">
                <div className="product-image-area">
                  <div className="product-image-bg-shape" />
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" alt="HR-Wise Dashboard UI" />
                </div>
                <div className="product-content-area">
                  <div>
                    <div className="product-logo-badge"><i className="fa-solid fa-users-gear me-2" /> HR Management</div>
                    <h2 className="product-title">HR-Wise</h2>
                    <p className="product-desc">Streamline your human resources with a platform built for modern US businesses. Manage applicant tracking, automated onboarding, compliance documentation, and employee performance seamlessly in one secure portal.</p>
                    <div className="product-features-grid">
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> W-4 &amp; I-9 Compliance</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Applicant Tracking System</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Automated Onboarding</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Performance Appraisals</div>
                    </div>
                    <div className="pricing-tier-wrapper">
                      <div className="pricing-title">Subscription Plans</div>
                      <div className="pricing-options-grid">
                        <div className="pricing-box">
                          <div className="billing-cycle">Monthly</div>
                          <div className="price-amt">$49</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Quarterly</div>
                          <div className="price-amt">$139</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Bi-Annual</div>
                          <div className="price-amt">$269</div>
                        </div>
                        <div className="pricing-box annual-box">
                          <div className="billing-cycle">Annual (Save 15%)</div>
                          <div className="price-amt">$499</div>
                        </div>
                      </div>
                    </div>
                    <div className="product-actions">
                      <a href="/hr-wise" className="btn-primary-custom px-4 py-2">Explore HR-Wise <i className="fa-solid fa-arrow-right ms-2" /></a>
                    </div>
                  </div>
                </div>
              </div>
              {/* 2. Verus-POS */}
              <div className="product-showcase-card">
                <div className="product-image-area">
                  <div className="product-image-bg-shape" style={{background: 'linear-gradient(135deg, rgba(10,34,72,0.1), rgba(47,155,255,0.2))'}} />
                  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" alt="Verus-POS Terminal UI" />
                </div>
                <div className="product-content-area">
                  <div>
                    <div className="product-logo-badge"><i className="fa-solid fa-cash-register me-2" /> Point of Sale</div>
                    <h2 className="product-title">Verus-POS</h2>
                    <p className="product-desc">A blazing-fast point of sale software tailored for retail and hospitality SMEs. Sync inventory across multiple store locations in real-time, process payments securely, and generate actionable sales reports.</p>
                    <div className="product-features-grid">
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Stripe &amp; Square Integration</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Multi-Location Sync</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Live Sales Analytics</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Offline Mode Ready</div>
                    </div>
                    <div className="pricing-tier-wrapper">
                      <div className="pricing-title">Subscription Plans</div>
                      <div className="pricing-options-grid">
                        <div className="pricing-box">
                          <div className="billing-cycle">Monthly</div>
                          <div className="price-amt">$79</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Quarterly</div>
                          <div className="price-amt">$225</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Bi-Annual</div>
                          <div className="price-amt">$439</div>
                        </div>
                        <div className="pricing-box annual-box">
                          <div className="billing-cycle">Annual (Save 10%)</div>
                          <div className="price-amt">$850</div>
                        </div>
                      </div>
                    </div>
                    <div className="product-actions">
                      <a href="/verus-pos" className="btn-primary-custom px-4 py-2">Explore Verus-POS <i className="fa-solid fa-arrow-right ms-2" /></a>
                    </div>
                  </div>
                </div>
              </div>
              {/* 3. Exactus */}
              <div className="product-showcase-card">
                <div className="product-image-area">
                  <div className="product-image-bg-shape" style={{background: 'linear-gradient(135deg, rgba(255,122,26,0.1), rgba(10,34,72,0.1))'}} />
                  <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" alt="Exactus Payroll UI" />
                </div>
                <div className="product-content-area">
                  <div>
                    <div className="product-logo-badge"><i className="fa-solid fa-file-invoice-dollar me-2" /> Payroll &amp; Accounting</div>
                    <h2 className="product-title">Exactus</h2>
                    <p className="product-desc">Remove the headache from payday. Exactus is an IRS-compliant payroll and accounting solution that automates state and federal tax calculations, manages direct deposits, and tracks overtime flawlessly.</p>
                    <div className="product-features-grid">
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Automated Tax Calculations</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> US Bank Direct Deposits</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Overtime &amp; PTO Tracking</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> General Ledger Export</div>
                    </div>
                    <div className="pricing-tier-wrapper">
                      <div className="pricing-title">Subscription Plans</div>
                      <div className="pricing-options-grid">
                        <div className="pricing-box">
                          <div className="billing-cycle">Monthly</div>
                          <div className="price-amt">$99</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Quarterly</div>
                          <div className="price-amt">$285</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Bi-Annual</div>
                          <div className="price-amt">$549</div>
                        </div>
                        <div className="pricing-box annual-box">
                          <div className="billing-cycle">Annual (Save 15%)</div>
                          <div className="price-amt">$999</div>
                        </div>
                      </div>
                    </div>
                    <div className="product-actions">
                      <a href="/exactus" className="btn-primary-custom px-4 py-2">Explore Exactus <i className="fa-solid fa-arrow-right ms-2" /></a>
                    </div>
                  </div>
                </div>
              </div>
              {/* 4. Inventro */}
              <div className="product-showcase-card">
                <div className="product-image-area">
                  <div className="product-image-bg-shape" style={{background: 'linear-gradient(135deg, rgba(47,155,255,0.1), rgba(255,122,26,0.1))'}} />
                  <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80" alt="Inventro Warehouse UI" />
                </div>
                <div className="product-content-area">
                  <div>
                    <div className="product-logo-badge"><i className="fa-solid fa-boxes-stacked me-2" /> Inventory Management</div>
                    <h2 className="product-title">Inventro</h2>
                    <p className="product-desc">Maintain absolute control over your supply chain. Inventro allows US distributors and retailers to scan barcodes, set automated low-stock alerts, and predict purchasing needs via machine learning.</p>
                    <div className="product-features-grid">
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Barcode &amp; QR Scanning</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Predictive Low Stock Alerts</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Vendor Management API</div>
                      <div className="product-feature-item"><i className="fa-solid fa-check" /> Logistics Tracking</div>
                    </div>
                    <div className="pricing-tier-wrapper">
                      <div className="pricing-title">Subscription Plans</div>
                      <div className="pricing-options-grid">
                        <div className="pricing-box">
                          <div className="billing-cycle">Monthly</div>
                          <div className="price-amt">$59</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Quarterly</div>
                          <div className="price-amt">$169</div>
                        </div>
                        <div className="pricing-box">
                          <div className="billing-cycle">Bi-Annual</div>
                          <div className="price-amt">$319</div>
                        </div>
                        <div className="pricing-box annual-box">
                          <div className="billing-cycle">Annual (Save 15%)</div>
                          <div className="price-amt">$599</div>
                        </div>
                      </div>
                    </div>
                    <div className="product-actions">
                      <a href="/inventro" className="btn-primary-custom px-4 py-2">Explore Inventro <i className="fa-solid fa-arrow-right ms-2" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Footer === */}
        </div>
      </div>
      
    </>
  );
};

export default Products;
