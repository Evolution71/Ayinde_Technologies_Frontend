import React, { useRef, useState } from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/contact.css';
import Captcha from '../components/Captcha';
import { api } from '../api';
import NewsletterSection from '../components/NewsletterSection';

// Converted from 0448e219-contact.php (PHP). Markup and classes are unchanged.
const Contact = () => {
  useSiteStyles();
  const captchaRef = useRef(null);
  const [contactStatus, setContactStatus] = useState('idle');
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setContactError('');
    setContactStatus('sending');
    try {
      await api.submitContactForm({
        name: String(data.get('full_name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        subject: String(data.get('department') || 'General inquiry'),
        message: `Phone: ${data.get('phone') || ''}\n\n${data.get('message') || ''}`,
        captcha_token: captchaRef.current ? captchaRef.current.getToken() : null,
        captcha_answer: captchaRef.current ? captchaRef.current.getAnswer() : null,
      });
      setContactStatus('sent');
      form.reset();
      if (captchaRef.current) captchaRef.current.refresh();
    } catch (err) {
      setContactStatus('idle');
      setContactError(err.message || 'Could not send your message. Please try again.');
      if (captchaRef.current) captchaRef.current.refresh();
    }
  };

  return (
    <>
      <div className="ayinde-site contact-page">
        <div>
          {/* Contact Page Specific CSS */}
          {/* === Page Header === */}
          <header className="contact-header">
            <div className="container position-relative z-3 text-center">
              <span className="badge-custom badge-orange bg-white bg-opacity-10 border border-light mb-4">
                <span className="rounded-circle bg-warning d-inline-block me-2" style={{width: 8, height: 8}} /> SUPPORT &amp; SALES
              </span>
              <h1 className="display-font text-white mb-3" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Let's Build The Future.</h1>
              <p className="lead text-white-50 mx-auto mb-0" style={{maxWidth: 600, fontSize: '1.1rem', lineHeight: '1.6'}}>
                Ready to automate your operations? Reach out to our dedicated teams on the East and West Coasts.
              </p>
            </div>
          </header>
          {/* === Contact Section (Form & Info Cards) === */}
          <section className="py-5 bg-light" style={{marginTop: '-40px', position: 'relative', zIndex: 10}}>
            <div className="container">
              <div className="row g-5">
                {/* Left Column: Contact Form */}
                <div className="col-lg-7">
                  <div className="contact-form-wrapper">
                    <h3 className="display-font mb-2" style={{color: 'var(--color-navy)'}}>Send us a Message</h3>
                    <p className="text-muted mb-4 small">Fill out the form below and a representative will get back to you within 24 hours.</p>
                    <form onSubmit={handleContactSubmit} action="#" method="POST" className="contactform">
        {contactError && <div className="alert alert-danger">{contactError}</div>}
        {contactStatus === "sent" && <div className="alert alert-success">Thanks! Your message was sent.</div>}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="firstName" className="form-label">Full Name</label>
                          <input type="text" className="form-control" id="firstName" name="full_name" placeholder="Mia Doe" required />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" className="form-control" id="email" name="email" placeholder="mia@company.com" required />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="department" className="form-label">Select Service</label>
                          <select className="form-select" id="department" name="department">
                            <option value disabled selected>What are you looking for?</option>
                            <option>Website Development</option>
                            <option>Mobile App</option>
                            <option>Desktop App</option>
                            <option>Tech Consultation</option>
                            <option>Premium Enterprise</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input type="tel" className="form-control" id="phone" name="phone" placeholder="(123) 456-7890" />
                        </div>
                        <div className="col-12">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea className="form-control" id="message" name="message" rows={5} placeholder="Tell us about your project or inquiry..." required defaultValue={""} />
                        </div>
                        <div className="col-12 mt-4">
                          <Captcha ref={captchaRef} />
                          <button type="submit" className="btn-accent w-100 py-3" style={{fontSize: 16}}>Send Message <i className="fa-solid fa-paper-plane ms-2" /></button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Right Column: Direct Contact Info */}
                <div className="col-lg-5">
                  <div className="row g-4">
                    {/* Sales Info */}
                    <div className="col-12">
                      <div className="contact-info-card">
                        <div className="icon-box orange">
                          <i className="fa-solid fa-briefcase" />
                        </div>
                        <h4 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>Sales &amp; Strategy</h4>
                        <p className="text-muted small mb-3">Discuss new builds, strategies, and premium enterprise onboarding.</p>
                        <div className="fw-bold mb-1" style={{color: 'var(--color-navy)', fontSize: 14}}>Representative: Sophia</div>
                        <a href="tel:+13025150227" className="text-decoration-none d-block mb-1" style={{color: 'var(--color-navy)', fontWeight: 500}}><i className="fa-solid fa-phone me-2 text-muted" /> 1-302-515-0227</a>
                        <a href="mailto:sales@ayindetechnologies.com" className="text-decoration-none d-block hover-primary" style={{color: 'var(--color-blue)', fontWeight: 500}}><i className="fa-solid fa-envelope me-2 text-muted" /> sales@ayindetechnologies.com</a>
                      </div>
                    </div>
                    {/* Support Info */}
                    <div className="col-12">
                      <div className="contact-info-card">
                        <div className="icon-box blue">
                          <i className="fa-solid fa-headset" />
                        </div>
                        <h4 className="display-font mb-1" style={{color: 'var(--color-navy)'}}>Technical Support</h4>
                        <p className="text-muted small mb-3">Assistance for existing enterprise clients and active rollouts.</p>
                        <div className="fw-bold mb-1" style={{color: 'var(--color-navy)', fontSize: 14}}>Representative: Peter</div>
                        <a href="tel:+12015342657" className="text-decoration-none d-block mb-1" style={{color: 'var(--color-navy)', fontWeight: 500}}><i className="fa-solid fa-phone me-2 text-muted" /> 1-201-534-2657</a>
                        <a href="mailto:support@ayindetechnologies.com" className="text-decoration-none d-block hover-primary" style={{color: 'var(--color-blue)', fontWeight: 500}}><i className="fa-solid fa-envelope me-2 text-muted" /> support@ayindetechnologies.com</a>
                      </div>
                    </div>
                    {/* General Info */}
                    <div className="col-12">
                      <div className="contact-info-card" style={{background: 'var(--color-navy)', color: '#fff'}}>
                        <h4 className="display-font mb-1 text-white">General Information</h4>
                        <p className="text-white-50 small mb-3">For media inquiries, partnerships, and general questions.</p>
                        <a href="mailto:info@ayindetechnologies.com" className="text-decoration-none d-block" style={{color: '#fff', fontWeight: 500}}><i className="fa-solid fa-envelope me-2" style={{color: 'var(--color-orange)'}} /> info@ayindetechnologies.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === Locations & Maps Section === */}
          <section className="py-5">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-font" style={{color: 'var(--color-navy)'}}>Our Coast-to-Coast Coverage</h2>
                <p className="text-muted mx-auto" style={{maxWidth: 500}}>Operating across the United States to provide seamless support.</p>
              </div>
              <div className="row g-4">
                {/* East Coast HQ */}
                <div className="col-md-6">
                  <div className="map-overlay-badge">
                    <span className="rounded-circle bg-primary d-inline-block" style={{width: 8, height: 8}} /> East Coast HQ
                  </div>
                  <div className="map-container mb-3">
                    <iframe title="Map" src="https://maps.google.com/maps?q=19702,Delaware&t=&z=13&ie=UTF8&iwloc=&output=embed" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                  <div className="px-2">
                    <h5 className="fw-bold mb-1" style={{color: 'var(--color-navy)'}}>Delaware Headquarters</h5>
                    <p className="text-muted small"><i className="fa-solid fa-location-dot me-2 text-danger" /> DE 19702, United States</p>
                  </div>
                </div>
                {/* West Coast Lab */}
                <div className="col-md-6">
                  <div className="map-overlay-badge">
                    <span className="rounded-circle bg-warning d-inline-block" style={{width: 8, height: 8}} /> West Coast Lab
                  </div>
                  <div className="map-container mb-3">
                    <iframe title="Map" src="https://maps.google.com/maps?q=90301,California&t=&z=13&ie=UTF8&iwloc=&output=embed" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                  <div className="px-2">
                    <h5 className="fw-bold mb-1" style={{color: 'var(--color-navy)'}}>Inglewood Innovation Lab</h5>
                    <p className="text-muted small"><i className="fa-solid fa-location-dot me-2 text-danger" /> CA 90301, United States</p>
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

export default Contact;
