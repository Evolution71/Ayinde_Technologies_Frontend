import React from 'react';
import useSiteStyles from '../hooks/useSiteStyles';
import '../styles/site-base.css';
import '../styles/start-project.css';

// Converted from 37c9808c-start-project.php (PHP). Markup and classes are unchanged.
const StartProject = () => {
  useSiteStyles();
  const handleFormSubmit = (e) => {
    // Simulated submit, as in the PHP source. Wire to the backend when ready.
    e.preventDefault();
  };

  return (
    <>
      <div className="ayinde-site">
        <div>
          {/* Start Project Specific CSS */}
          {/* === Page Header === */}
          <header className="start-project-bg text-center">
            <div className="container position-relative z-3">
              <span className="badge-custom badge-orange bg-white bg-opacity-10 border border-light mb-4">
                PROJECT INITIATION
              </span>
              <h1 className="display-font text-white mb-3" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Let's Build Something Great.</h1>
              <p className="lead text-white-50 mx-auto mb-0" style={{maxWidth: 650, fontSize: '1.1rem', lineHeight: '1.6'}}>
                Fill out the brief below with your project requirements. Our engineering team will review your scope and follow up to schedule a strategy session.
              </p>
            </div>
          </header>
          {/* === Form Container Section === */}
          <section className="pb-5 bg-white">
            <div className="container">
              <div className="application-card row g-0">
                {/* Left Side: Process & Expectations */}
                <div className="col-lg-4 process-panel">
                  <h3 className="display-font mb-4" style={{color: 'var(--color-navy)'}}>What happens next?</h3>
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h5>Submit Your Brief</h5>
                      <p>Share your vision, budget, and attach any relevant documentation or RFPs.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h5>Internal Review</h5>
                      <p>Our senior architects review your requirements to assemble the right tech stack.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h5>Discovery Call</h5>
                      <p>We'll schedule a video call within 48 hours to align on strategy and timelines.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number"><i className="fa-solid fa-check" /></div>
                    <div className="step-content">
                      <h5>Project Proposal</h5>
                      <p>You receive a comprehensive blueprint and quote to greenlight the build.</p>
                    </div>
                  </div>
                  <div className="mt-5 p-4 rounded-4" style={{background: 'rgba(10,34,72,0.05)', border: '1px solid rgba(0,0,0,0.05)'}}>
                    <div className="fw-bold mb-2 text-navy" style={{fontSize: '0.9rem'}}>Need immediate assistance?</div>
                    <a href="mailto:hello@ayindetechnologies.com" className="text-decoration-none d-block small mb-1 hover-primary" style={{color: 'var(--color-blue)'}}><i className="fa-solid fa-envelope me-2" />hello@ayindetechnologies.com</a>
                    <a href="tel:+13025150227" className="text-decoration-none d-block small text-muted"><i className="fa-solid fa-phone me-2" />1-302-515-0227</a>
                  </div>
                </div>
                {/* Right Side: The Form */}
                <div className="col-lg-8 form-panel">
                  <form onSubmit={handleFormSubmit} action="process_project.php" method="POST" encType="multipart/form-data">
                    {/* Section 1: Contact Info */}
                    <div className="form-section-title">1. Contact Information</div>
                    <div className="row g-3 mb-5">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="text" className="form-control" id="fName" name="first_name" placeholder="First Name" required />
                          <label htmlFor="fName">First Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="text" className="form-control" id="lName" name="last_name" placeholder="Last Name" required />
                          <label htmlFor="lName">Last Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="email" className="form-control" id="emailAdd" name="email" placeholder="Email" required />
                          <label htmlFor="emailAdd">Corporate Email</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="tel" className="form-control" id="phoneNum" name="phone" placeholder="Phone" />
                          <label htmlFor="phoneNum">Phone Number</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input type="text" className="form-control" id="company" name="company" placeholder="Company Name" />
                          <label htmlFor="company">Company / Organization Name</label>
                        </div>
                      </div>
                    </div>
                    {/* Section 2: Project Scope */}
                    <div className="form-section-title">2. Project Scope &amp; Budget</div>
                    <div className="row g-3 mb-5">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select className="form-select" id="serviceType" name="service_type" required>
                            <option value disabled selected>What do you need built?</option>
                            <option value="Web Development">Website &amp; Web App Development</option>
                            <option value="Mobile App">Mobile Application (iOS/Android)</option>
                            <option value="Tech Consulting">Tech Consulting &amp; Strategy</option>
                            <option value="Premium Suite">Premium Suite (Web, App &amp; Desktop)</option>
                            <option value="Other">Other / Not Sure Yet</option>
                          </select>
                          <label htmlFor="serviceType">Primary Service</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select className="form-select" id="budgetRange" name="budget" required>
                            <option value disabled selected>Select an estimated budget...</option>
                            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                            <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                            <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                            <option value="$50,000+">$50,000+ (Enterprise)</option>
                            <option value="To Be Determined">To Be Determined</option>
                          </select>
                          <label htmlFor="budgetRange">Estimated Budget</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea className="form-control" id="projectDetails" name="project_details" placeholder="Project Details" required defaultValue={""} />
                          <label htmlFor="projectDetails">Project Description (Goals, target audience, timeline, required features)</label>
                        </div>
                      </div>
                    </div>
                    {/* Section 3: Attachments */}
                    <div className="form-section-title">3. Supporting Documents</div>
                    <div className="mb-4">
                      <p className="text-muted small mb-3">Attach any wireframes, RFP documents, business plans, or presentations that will help us understand your vision.</p>
                      {/* Custom Drag & Drop UI */}
                      <div className="file-upload-zone" id="dropZone">
                        <input type="file" id="fileInput" name="attachments[]" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" />
                        <div className="upload-icon"><i className="fa-solid fa-cloud-arrow-up" /></div>
                        <h6 className="fw-bold text-navy mb-1">Click to browse or drag files here</h6>
                        <p className="text-muted small mb-0">Supported formats: PDF, Word, PowerPoint, Images (Max: 10MB)</p>
                        <div className="file-name-display" id="fileList" />
                      </div>
                    </div>
                    {/* Submit Action */}
                    <div className="mt-5 pt-3 border-top d-flex align-items-center justify-content-between">
                      <div className="text-muted small" style={{maxWidth: 300}}>
                        <i className="fa-solid fa-lock text-success me-1" /> Your information is securely encrypted and strictly confidential.
                      </div>
                      <button type="submit" className="btn-primary-custom px-5 py-3" style={{fontSize: 16}}>
                        Submit Project Brief <i className="fa-solid fa-paper-plane ms-2" />
                      </button>
                    </div>
                  </form>
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

export default StartProject;
