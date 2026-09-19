import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectsSection from '../components/Projects';
import CoursesSection from '../components/Courses';
import Captcha from '../components/Captcha';
import { api } from '../api';
import heroIllustration from '../assets/hero-illustration.svg';

// Scrolls to a section when arriving at "/" with a #hash — used when the
// nav links are clicked from a different page (e.g. /about -> /#services).
function useHashScroll() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);
}

// Hero Section
const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Guide, Build &amp; Implement AI Technologies</h1>
        <p className="hero-subtitle">
          Ayinde Technologies partners with businesses end-to-end — from strategy and planning
          through a shipped AI application or website, then hands-on support getting it adopted.
        </p>
        <div className="hero-buttons">
          <a href="#contact" className="btn btn-primary">Get Started</a>
          <a href="#services" className="btn btn-secondary">Learn More</a>
        </div>
        <div className="hero-pillars">
          <div className="pillar">
            <h3>Guide</h3>
            <p>Business, marketing &amp; proposal planning</p>
          </div>
          <div className="pillar">
            <h3>Build</h3>
            <p>AI apps &amp; websites, built from scratch</p>
          </div>
          <div className="pillar">
            <h3>Implement</h3>
            <p>Hands-on rollout &amp; team support</p>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <img src={heroIllustration} alt="" className="hero-illustration" />
      </div>
    </section>
  );
};

// Services Section
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setLoading(false);
      });
  }, []);

  const icons = {
    brain: '🧠',
    globe: '🌐',
    target: '🎯',
    chart: '📊',
    rocket: '🚀',
    zap: '⚡'
  };

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">Complete technology solutions to transform your business</p>

        {loading ? (
          <p className="loading">Loading services...</p>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{icons[service.icon]}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <ul className="features-list">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Team Section
const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeam()
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching team:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="team" id="team">
      <div className="container">
        <h2 className="section-title">Our Team</h2>
        <p className="section-subtitle">Expert professionals dedicated to your success</p>

        {loading ? (
          <p className="loading">Loading team...</p>
        ) : (
          <div className="team-grid">
            {team.map(member => (
              <div key={member.id} className="team-card">
                <div className="member-avatar">{member.image}</div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
                <div className="expertise">
                  {member.expertise.map((exp, idx) => (
                    <span key={idx} className="expertise-badge">{exp}</span>
                  ))}
                </div>
                {(member.email || member.phone) && (
                  <div className="member-contact">
                    {member.email && <a href={`mailto:${member.email}`}>{member.email}</a>}
                    {member.phone && <span className="member-phone">{member.phone}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const captchaRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const captchaToken = captchaRef.current ? captchaRef.current.getToken() : null;
    const captchaAnswer = captchaRef.current ? captchaRef.current.getAnswer() : '';

    try {
      await api.submitContact({
        ...formData,
        captcha_token: captchaToken,
        captcha_answer: captchaAnswer,
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
      if (captchaRef.current) captchaRef.current.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">Let's discuss how we can help transform your business</p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h4>📍 Address</h4>
              <p>112 S Market St, Suite 1008<br />Inglewood, CA 90301<br />United States</p>
            </div>
            <div className="info-item">
              <h4>📞 Phone</h4>
              <p><a href="tel:+1949-66-7869">+1 949-662-7869</a></p>
            </div>
            <div className="info-item">
              <h4>📧 Email</h4>
              <p><a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a></p>
            </div>
            <div className="info-item">
              <h4>🕐 Response Time</h4>
              <p>Within 24 hours</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {success && <div className="alert alert-success">Message sent successfully! We'll contact you soon.</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            <Captcha ref={captchaRef} />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  useHashScroll();
  return (
    <>
      <Hero />
      <Services />
      <ProjectsSection />
      <CoursesSection />
      <Team />
      <Contact />
    </>
  );
}