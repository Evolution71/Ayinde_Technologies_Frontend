import React from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/terms.css';
import NewsletterSection from '../components/NewsletterSection';

// Converted from 5ac9d417-terms-and-conditions.php (PHP). Markup and classes are unchanged.
const TermsAndConditions = () => {
  useSiteStyles();
  return (
    <>
      <div className="ayinde-site terms-page">
        <div>
          {/* Legal Pages Specific CSS */}
          {/* === Page Header === */}
          <header className="legal-header">
            <div className="container text-center">
              <h1 className="display-font mb-3" style={{color: 'var(--color-navy)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)'}}>Legal &amp; Privacy</h1>
              <p className="text-muted mx-auto mb-0" style={{maxWidth: 600, fontSize: '1.1rem'}}>
                Terms of Use, Privacy Policy, and Agreements for Ayinde Technologies Corporation' products, services, and educational resources.
              </p>
              <div className="mt-3 text-secondary small">Last Updated: October 2026</div>
            </div>
          </header>
          {/* === Main Content Section === */}
          <section className="py-5 bg-light" style={{position: 'relative'}}>
            <div className="container py-4">
              {/* align-items-start is critical here to prevent the sidebar column from stretching to 100% height, which breaks position: sticky */}
              <div className="row g-5 align-items-start">
                {/* Sticky Sidebar Navigation */}
                <div className="col-lg-3">
                  <nav className="sticky-sidebar-container" id="legalSidebar">
                    <a href="#terms-of-use" className="legal-nav-link active">1. Terms of Use</a>
                    <a href="#privacy-policy" className="legal-nav-link">2. Privacy Policy</a>
                    <a href="#saas-terms" className="legal-nav-link">3. SaaS Product Terms</a>
                    <a href="#service-terms" className="legal-nav-link">4. Service Agreements</a>
                    <a href="#course-terms" className="legal-nav-link">5. Educational Courses</a>
                  </nav>
                </div>
                {/* Legal Documents Content */}
                <div className="col-lg-9">
                  <div className="legal-content-wrapper" style={{textAlign: 'justify'}}>
                    {/* 1. Terms of Use */}
                    <div id="terms-of-use" className="legal-section">
                      <h2>1. General Terms of Use</h2>
                      <p>Welcome to Ayinde Technologies Corporation. By accessing our website (www.ayindetechnologies.com) and using our services, products, or educational materials, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Site or services.</p>
                      <h3>1.1 Intellectual Property</h3>
                      <p>All content on this Site, including but not limited to text, graphics, logos, software, and proprietary architecture, is the property of Ayinde Technologies Corporation and is protected by United States and international copyright laws. You may not reproduce, distribute, or create derivative works without express written consent.</p>
                      <h3>1.2 User Conduct</h3>
                      <p>You agree to use our Site and services only for lawful purposes. You are prohibited from attempting to breach our security systems, introducing malicious code, or utilizing our platforms to conduct fraudulent activities.</p>
                    </div>
                    {/* 2. Privacy Policy */}
                    <div id="privacy-policy" className="legal-section">
                      <h2>2. Privacy Policy</h2>
                      <p>Ayinde Technologies Corporation is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your data.</p>
                      <h3>2.1 Information We Collect</h3>
                      <ul>
                        <li><strong>Personal Information:</strong> Names, corporate emails, phone numbers, and company details provided via our contact, project initiation, and subscription forms.</li>
                        <li><strong>Financial Information:</strong> Payment details are processed directly through secure third-party gateways (e.g., Stripe). We do not store full credit card numbers on our servers.</li>
                        <li><strong>Usage Data:</strong> We collect non-identifiable data regarding site navigation, product usage, and interaction with our digital properties to improve user experience.</li>
                      </ul>
                      <h3>2.2 How We Use Your Data</h3>
                      <p>Your information is used strictly to provide and improve our services, process transactions, communicate project updates, and deliver customer support. We do not sell your personal data to third parties.</p>
                    </div>
                    {/* 3. SaaS Product Terms */}
                    <div id="saas-terms" className="legal-section">
                      <h2>3. SaaS Product Terms</h2>
                      <p>These terms apply specifically to subscribers of our Enterprise SaaS Suite, including HR-Wise, Verus-POS, Exactus, and Inventro.</p>
                      <h3>3.1 Subscriptions and Billing</h3>
                      <p>Services are billed on a recurring basis (Monthly, Quarterly, Bi-Annually, or Annually) as selected during checkout. Payments are non-refundable unless expressly stated in a specific Service Level Agreement (SLA). Cancellations must be made at least 14 days prior to the next billing cycle.</p>
                      <h3>3.2 Data Ownership and Security</h3>
                      <p>You retain full ownership of all business data inputted into our SaaS products. Ayinde Technologies Corporation employs AES-256 encryption and industry-standard security protocols to ensure your data remains secure. In the event of subscription termination, you have 30 days to export your data before it is permanently deleted from our servers.</p>
                    </div>
                    {/* 4. Service Agreements */}
                    <div id="service-terms" className="legal-section">
                      <h2>4. Custom Services &amp; Consulting</h2>
                      <p>For custom web development, app development, and tech consulting services, the following terms apply:</p>
                      <h3>4.1 Project Scope and Delivery</h3>
                      <p>All custom builds are governed by a mutually signed Statement of Work (SOW) or project brief. Upfront commitment fees or retainers are fully refundable only if a project scope cannot be mutually agreed upon prior to the commencement of engineering work.</p>
                      <h3>4.2 Warranties</h3>
                      <p>We warrant that custom software will perform substantially in accordance with its documentation for a period of 90 days following deployment. Extended warranties and priority maintenance are available under our Premium Service tiers.</p>
                    </div>
                    {/* 5. Educational Courses */}
                    <div id="course-terms" className="legal-section">
                      <h2>5. Educational Courses &amp; Masterclasses</h2>
                      <p>Ayinde Technologies Corporation provides free, open-source educational content via our YouTube channel and website.</p>
                      <h3>5.1 Usage of Educational Content</h3>
                      <p>Our courses are provided for educational and informational purposes only. While we strive for accuracy, Ayinde Technologies Corporation makes no guarantees regarding the outcome of implementing strategies discussed in these videos. You may share and link to our public videos, but you may not re-upload, monetize, or package our free courses as paid material.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Newsletter Section === */}
          <NewsletterSection />
        </div>
      </div>
      
    </>
  );
};

export default TermsAndConditions;
