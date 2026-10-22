import React from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/services.css';
import NewsletterSection from '../components/NewsletterSection';

// Converted from a84c3078-services.php (PHP). Markup and classes are unchanged.
const Services = () => {
  useSiteStyles();
  return (
    <>
      <div className="ayinde-site">
        <div>
          {/* Services Page Specific CSS */}
          {/* === Page Header === */}
          <header className="services-header">
            <div className="container position-relative z-3 text-center">
              <span className="badge-custom badge-navy bg-white border border-light mb-4 shadow-sm">
                OUR EXPERTISE
              </span>
              <h1 className="display-font mb-3" style={{color: 'var(--color-navy)', fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>End-to-End Solutions.</h1>
              <p className="lead text-muted mx-auto mb-0" style={{maxWidth: 600, fontSize: '1.1rem', lineHeight: '1.6'}}>
                We architect, design, and engineer tailored technology solutions that drive efficiency and scale your enterprise.
              </p>
            </div>
          </header>
          {/* === Services List Section === */}
          <section className="py-5">
            <div className="container">
              {/* 1. Website Development */}
              <div className="service-block">
                <div className="service-image-area">
                  <div className="position-absolute inset-0 w-100 h-100 overlay-web z-1" />
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Website Development" />
                </div>
                <div className="service-content-area">
                  <div className="service-icon-wrapper icon-web">
                    <i className="fa-solid fa-laptop-code" />
                  </div>
                  <h2 className="display-font service-title">Website Development</h2>
                  <p className="service-desc">We build lightning-fast, highly secure, and conversion-optimized websites. From corporate landing pages to complex e-commerce ecosystems, our web solutions are designed to perform beautifully across all devices.</p>
                  <ul className="service-features">
                    <li><i className="fa-solid fa-check" /> Custom UI/UX Design</li>
                    <li><i className="fa-solid fa-check" /> E-Commerce Platforms</li>
                    <li><i className="fa-solid fa-check" /> CMS Integration</li>
                    <li><i className="fa-solid fa-check" /> SEO Optimization</li>
                  </ul>
                  <a href="/website-development" className="btn-service-link">View Service Details →</a>
                </div>
              </div>
              {/* 2. App Development */}
              <div className="service-block">
                <div className="service-image-area">
                  <div className="position-absolute inset-0 w-100 h-100 overlay-app z-1" />
                  <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" alt="App Development" />
                </div>
                <div className="service-content-area">
                  <div className="service-icon-wrapper icon-app">
                    <i className="fa-solid fa-mobile-screen-button" />
                  </div>
                  <h2 className="display-font service-title">App Development</h2>
                  <p className="service-desc">Transform your business logic into powerful mobile and desktop applications. We develop intuitive, high-performance apps for iOS, Android, and cross-platform environments using the latest frameworks.</p>
                  <ul className="service-features">
                    <li><i className="fa-solid fa-check" /> iOS &amp; Android Native</li>
                    <li><i className="fa-solid fa-check" /> Cross-Platform Apps</li>
                    <li><i className="fa-solid fa-check" /> Enterprise Software</li>
                    <li><i className="fa-solid fa-check" /> API Integrations</li>
                  </ul>
                  <a href="/app-development" className="btn-service-link">View Service Details →</a>
                </div>
              </div>
              {/* 3. Tech Consulting */}
              <div className="service-block">
                <div className="service-image-area">
                  <div className="position-absolute inset-0 w-100 h-100 overlay-consult z-1" />
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Tech Consulting" />
                </div>
                <div className="service-content-area">
                  <div className="service-icon-wrapper icon-consult">
                    <i className="fa-solid fa-network-wired" />
                  </div>
                  <h2 className="display-font service-title">Tech Consulting</h2>
                  <p className="service-desc">Plan before you build. Our tech consulting services help you map out infrastructure, choose the right tech stack, and design automated workflows before writing a single line of code, saving you time and resources.</p>
                  <ul className="service-features">
                    <li><i className="fa-solid fa-check" /> Architecture Planning</li>
                    <li><i className="fa-solid fa-check" /> Workflow Automation</li>
                    <li><i className="fa-solid fa-check" /> Security Audits</li>
                    <li><i className="fa-solid fa-check" /> Cloud Strategy</li>
                  </ul>
                  <a href="/tech-consulting" className="btn-service-link">View Service Details →</a>
                </div>
              </div>
              {/* 4. Premium Services */}
              <div className="service-block premium-block">
                <div className="service-image-area">
                  <div className="position-absolute inset-0 w-100 h-100 overlay-premium z-1" />
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" alt="Premium Services" />
                </div>
                <div className="service-content-area">
                  <div className="service-icon-wrapper icon-premium">
                    <i className="fa-solid fa-crown" />
                  </div>
                  <h2 className="display-font service-title">Premium Services</h2>
                  <p className="service-desc">Designed for enterprise-level scale. Get priority development, dedicated account managers, advanced AI integration, and flexible payment terms. We stay with you actively through the entire rollout.</p>
                  <ul className="service-features">
                    <li><i className="fa-solid fa-check" style={{color: 'var(--color-orange)'}} /> Dedicated Manager</li>
                    <li><i className="fa-solid fa-check" style={{color: 'var(--color-orange)'}} /> Advanced AI Tools</li>
                    <li><i className="fa-solid fa-check" style={{color: 'var(--color-orange)'}} /> Priority Support</li>
                    <li><i className="fa-solid fa-check" style={{color: 'var(--color-orange)'}} /> Flexible Payments</li>
                  </ul>
                  <a href="/premium-services" className="btn-service-link">Explore Premium Tier →</a>
                </div>
              </div>
            </div>
          </section>
          {/* === CTA Section === */}
          <section className="py-5 bg-white border-top">
            <div className="container text-center py-4">
              <h2 className="display-font mb-3" style={{color: 'var(--color-navy)'}}>Not sure where to start?</h2>
              <p className="text-muted mb-4 mx-auto" style={{maxWidth: 500}}>Book a free strategy session with our team to discuss your goals and find the perfect technology path for your business.</p>
              <a href="/contact" className="btn-accent"><i className="fa-solid fa-calendar-check me-2" /> Book Strategy Call</a>
            </div>
          </section>
          {/* === Newsletter Section === */}
          <NewsletterSection />
        </div>
      </div>
      
    </>
  );
};

export default Services;
