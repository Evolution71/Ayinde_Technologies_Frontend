import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProjectsSection from './components/Projects';
import CoursesSection from './components/Courses';
import Captcha from './components/Captcha';
import { api } from './api';

// Backend API URL — set REACT_APP_API_URL in a .env file for production;
// falls back to localhost for local development.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Ayinde Technologies</span>
        </div>
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <a href="#home" className="nav-link">Home</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#courses" className="nav-link">Courses</a>
          <a href="#team" className="nav-link">Team</a>
          <a href="#contact" className="nav-link contact-btn">Contact Us</a>
          {user ? (
            <span className="nav-user">
              Hi, {user.name.split(' ')[0]} · <button className="link-btn" onClick={logout}>Log out</button>
            </span>
          ) : (
            <a href="#projects" className="nav-link">Log in</a>
          )}
        </div>
        <button 
          className="hamburger" 
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Guide, Build & Implement AI Technologies</h1>
        <p className="hero-subtitle">
          Empower your business with cutting-edge technology solutions. From AI apps to complete digital transformation.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>25+</h3>
            <p>Satisfied Clients</p>
          </div>
          <div className="stat">
            <h3>50+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stat">
            <h3>10+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
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
    fetch(`${API_URL}/api/team`)
      .then(res => res.json())
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
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const captchaRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              <p>Nigeria</p>
            </div>
            <div className="info-item">
              <h4>📞 Phone</h4>
              <p>+234 (XXX) XXX-XXXX</p>
            </div>
            <div className="info-item">
              <h4>📧 Email</h4>
              <p>info@ayindetech.com</p>
            </div>
            <div className="info-item">
              <h4>🕐 Response Time</h4>
              <p>Within 24 hours</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {success && <div className="alert alert-success">Message sent successfully! We'll contact you soon.</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <Captcha ref={captchaRef} />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Ayinde Technologies</h4>
            <p>Guide, Build & Implement AI Technologies</p>
          </div>
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">AI App Development</a></li>
              <li><a href="#services">Web Development</a></li>
              <li><a href="#services">Tech Consulting</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#home">About Us</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#team">Team</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">Twitter</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Ayinde Technologies Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function AppContent() {
  return (
    <div className="app">
      <Navigation />
      <Hero />
      <Services />
      <ProjectsSection />
      <CoursesSection />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
