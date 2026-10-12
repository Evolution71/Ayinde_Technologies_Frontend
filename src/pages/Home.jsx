import React from 'react';
import { Link } from 'react-router-dom';
import servicesIllustration from '../assets/services-illustration.svg';
import processIllustration from '../assets/process-illustration.svg';
import VideoBackground from '../components/VideoBackground';

export default function Home() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 60px 20px;
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .hero-title {
          color: white;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 20px;
          animation: slideInDown 0.8s ease-out;
        }

        .hero-subtitle {
          color: #fbbf24;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          animation: slideInDown 0.8s ease-out 0.1s both;
        }

        .hero-description {
          color: rgba(255, 255, 255, 0.95);
          font-size: clamp(16px, 2vw, 20px);
          max-width: 600px;
          margin: 20px auto 40px;
          line-height: 1.6;
          animation: slideInUp 0.8s ease-out 0.2s both;
        }

        .hero-cta {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24, #ff6b35);
          color: white;
          padding: 16px 48px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 800;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
          animation: slideInUp 0.8s ease-out 0.3s both;
          cursor: pointer;
          border: none;
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 107, 53, 0.6);
          background: linear-gradient(135deg, #ff6b35, #ff5722);
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .floating-icon {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 32px;
          animation: float 3s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes float {
          0%, 100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-20px);
          }
        }

        .carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 3;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: white;
          transform: scale(1.2);
        }

        /* Value Proposition Section */
        .value-proposition {
          padding: 100px 20px;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .value-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation: slideUp 0.6s ease-out both;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .value-card:nth-child(1) { animation-delay: 0.1s; }
        .value-card:nth-child(2) { animation-delay: 0.2s; }
        .value-card:nth-child(3) { animation-delay: 0.3s; }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .value-card:hover {
          box-shadow: 0 20px 50px rgba(30, 64, 175, 0.15);
          transform: translateY(-8px);
          border-color: #fbbf24;
        }

        .value-card h3 {
          color: #1e40af;
          font-size: 20px;
          margin-bottom: 15px;
          transition: color 0.3s ease;
        }

        .value-card:hover h3 {
          color: #ff6b35;
        }

        .value-card p {
          color: #6b7280;
          line-height: 1.7;
          margin: 0;
        }

        .value-section-title {
          text-align: center;
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 20px;
          animation: fadeIn 0.8s ease-out;
        }

        .value-section-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 60px;
          line-height: 1.6;
          animation: fadeIn 0.8s ease-out 0.1s both;
        }

        /* Services Section */
        .services {
          padding: 100px 20px;
          background: white;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-top: 60px;
        }

        .services-content h2 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 20px;
          line-height: 1.3;
          animation: slideInLeft 0.8s ease-out;
        }

        .services-content p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 20px;
          animation: slideInLeft 0.8s ease-out 0.1s both;
        }

        .services-eyebrow {
          color: #1e40af;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          animation: slideInLeft 0.8s ease-out 0.05s both;
        }

        .services-image {
          animation: slideInRight 0.8s ease-out;
          transition: transform 0.3s ease;
        }

        .services-image:hover {
          transform: scale(1.05);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Process Section */
        .process {
          padding: 100px 20px;
          background: #f9fafb;
        }

        .process-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-top: 60px;
        }

        .process-content h2 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 20px;
          line-height: 1.3;
          animation: slideInRight 0.8s ease-out;
        }

        .process-content p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 20px;
          animation: slideInRight 0.8s ease-out 0.1s both;
        }

        .process-eyebrow {
          color: #1e40af;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          animation: slideInRight 0.8s ease-out 0.05s both;
        }

        .process-image {
          animation: slideInLeft 0.8s ease-out;
          transition: transform 0.3s ease;
        }

        .process-image:hover {
          transform: scale(1.05);
        }

        /* Why Us Section */
        .why-us {
          padding: 100px 20px;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          text-align: center;
        }

        .why-us-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          animation: zoomIn 0.8s ease-out;
        }

        .why-us-subtitle {
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 60px;
          line-height: 1.6;
          opacity: 0.95;
          animation: fadeIn 0.8s ease-out 0.1s both;
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out both;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #fbbf24;
          transform: translateY(-8px);
        }

        .feature-card h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .feature-card p {
          font-size: 14px;
          opacity: 0.9;
        }

        /* Quotes Section */
        .quotes {
          padding: 100px 20px;
          background: white;
        }

        .quotes-title {
          text-align: center;
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 60px;
          animation: fadeIn 0.8s ease-out;
        }

        .quotes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .quote-card {
          background: #f9fafb;
          padding: 40px;
          border-radius: 12px;
          border-left: 4px solid #1e40af;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out both;
        }

        .quote-card:nth-child(1) { animation-delay: 0.1s; }
        .quote-card:nth-child(2) { animation-delay: 0.2s; }
        .quote-card:nth-child(3) { animation-delay: 0.3s; }

        .quote-card:hover {
          box-shadow: 0 20px 50px rgba(30, 64, 175, 0.15);
          transform: translateY(-8px);
          border-left-color: #ff6b35;
        }

        .quote-text {
          color: #1f2937;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 20px;
          font-style: italic;
        }

        .quote-author {
          color: #6b7280;
          font-weight: 600;
          font-size: 14px;
        }

        /* Team Section */
        .team {
          padding: 100px 20px;
          background: #f9fafb;
        }

        .team-title {
          text-align: center;
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 60px;
          animation: fadeIn 0.8s ease-out;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }

        .team-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out both;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .team-card:nth-child(1) { animation-delay: 0.1s; }
        .team-card:nth-child(2) { animation-delay: 0.2s; }
        .team-card:nth-child(3) { animation-delay: 0.3s; }
        .team-card:nth-child(4) { animation-delay: 0.4s; }

        .team-card:hover {
          box-shadow: 0 20px 50px rgba(30, 64, 175, 0.15);
          transform: translateY(-8px);
          border-color: #fbbf24;
        }

        .team-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 15px;
        }

        .team-card h3 {
          color: #1e40af;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .team-card p {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        /* CTA Section */
        .cta {
          padding: 100px 20px;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          text-align: center;
        }

        .cta-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          animation: slideInDown 0.8s ease-out;
        }

        .cta-subtitle {
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
          opacity: 0.95;
          animation: slideInUp 0.8s ease-out 0.1s both;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24, #ff6b35);
          color: white;
          padding: 16px 48px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 800;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
          animation: slideInUp 0.8s ease-out 0.2s both;
          border: none;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 107, 53, 0.6);
          background: linear-gradient(135deg, #ff6b35, #ff5722);
        }

        /* Footer */
        .footer {
          background: #111827;
          color: #d1d5db;
          padding: 60px 20px 20px;
          font-size: 14px;
          line-height: 1.8;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .footer-section a {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.3s ease;
          display: block;
          margin-bottom: 10px;
        }

        .footer-section a:hover {
          color: #fbbf24;
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 20px;
          text-align: center;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 16px;
          }

          .services-grid,
          .process-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .value-grid,
          .features-grid,
          .quotes-grid,
          .team-grid,
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .cta-title,
          .why-us-title,
          .value-section-title,
          .services-grid > h2,
          .process-grid > h2,
          .quotes-title,
          .team-title {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <VideoBackground minHeight="600px">
        <div className="container hero-content">
          <p className="hero-subtitle">Welcome to Ayinde Technologies</p>
          <h1 className="hero-title">We guide, build, and stay hands-on until it's running.</h1>
          <p className="hero-description">
            Your trusted technology partner for AI applications, websites, and digital transformation.
          </p>
          <Link to="/services" className="hero-cta">Get Started</Link>
          <div className="floating-icon">⬇️</div>
          <div className="carousel-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </VideoBackground>

      <section className="value-proposition">
        <div className="container">
          <h2 className="value-section-title">Why Choose Ayinde Technologies?</h2>
          <p className="value-section-subtitle">
            We deliver more than code. We deliver solutions that work.
          </p>
          <div className="value-grid">
            <div className="value-card">
              <h3>📋 Strategic Planning</h3>
              <p>We start with understanding your business goals. Every line of code serves a purpose rooted in your strategy.</p>
            </div>
            <div className="value-card">
              <h3>🚀 Expert Execution</h3>
              <p>Our team builds with precision, using the latest technologies and best practices to ensure quality and scalability.</p>
            </div>
            <div className="value-card">
              <h3>🤝 Ongoing Support</h3>
              <p>Launch is just the beginning. We provide continuous support and optimization to ensure your success.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container services-grid">
          <div className="services-content">
            <p className="services-eyebrow">Our Services</p>
            <h2>Comprehensive Solutions for Digital Growth</h2>
            <p>
              From AI-powered applications to custom websites, we provide end-to-end solutions tailored to your unique business needs.
            </p>
            <p>
              Our team specializes in building scalable, maintainable systems that drive real business value. We work closely with you at every stage to ensure we're building exactly what you need.
            </p>
            <Link to="/services" className="hero-cta">Explore Services</Link>
          </div>
          <img src={servicesIllustration} alt="Services" className="services-image" />
        </div>
      </section>

      <section className="process">
        <div className="container process-grid">
          <img src={processIllustration} alt="Process" className="process-image" />
          <div className="process-content">
            <p className="process-eyebrow">Our Process</p>
            <h2>From Concept to Execution</h2>
            <p>
              We follow a proven methodology that ensures transparent communication, quality deliverables, and long-term success.
            </p>
            <p>
              Our three-phase approach (Plan, Build, Implement) guarantees that we're aligned with your goals every step of the way.
            </p>
            <Link to="/contact-form" className="hero-cta">Start Your Project</Link>
          </div>
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <h2 className="why-us-title">Why Companies Trust Us</h2>
          <p className="why-us-subtitle">
            We combine technical expertise with business acumen to deliver solutions that matter.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🎯 Results-Driven</h3>
              <p>Every project is measured by real business outcomes, not just deliverables.</p>
            </div>
            <div className="feature-card">
              <h3>🔧 Technical Excellence</h3>
              <p>We use proven technologies and architectural patterns to build robust systems.</p>
            </div>
            <div className="feature-card">
              <h3>⏱️ On-Time Delivery</h3>
              <p>We respect your timeline and deliver quality without compromise.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quotes">
        <div className="container">
          <h2 className="quotes-title">What Our Clients Say</h2>
          <div className="quotes-grid">
            <div className="quote-card">
              <p className="quote-text">
                "Ayinde Technologies didn't just build our platform—they transformed how we do business. Exceptional work."
              </p>
              <p className="quote-author">— Alex Johnson, Tech Startup CEO</p>
            </div>
            <div className="quote-card">
              <p className="quote-text">
                "The team went above and beyond. They understood our vision and executed it flawlessly. Highly recommended."
              </p>
              <p className="quote-author">— Maria Rodriguez, Marketing Director</p>
            </div>
            <div className="quote-card">
              <p className="quote-text">
                "Finally, a technical partner that speaks our language and delivers results. We'll work with them again."
              </p>
              <p className="quote-author">— David Chen, Operations Manager</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team">
        <div className="container">
          <h2 className="team-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">🧑‍💻</div>
              <h3>Sarah Williams</h3>
              <p>Lead Developer & Co-Founder</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👨‍🏫</div>
              <h3>Michael Grant</h3>
              <p>Full-Stack Engineer</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">🎨</div>
              <h3>Jessica Lee</h3>
              <p>Product & Design Lead</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">📊</div>
              <h3>Robert Martinez</h3>
              <p>Business Strategist</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your Business?</h2>
          <p className="cta-subtitle">
            Let's talk about your next project. We're ready to help you succeed.
          </p>
          <Link to="/contact-form" className="cta-button">Schedule Consultation</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Ayinde Technologies</h4>
              <p>Building the future, one line of code at a time.</p>
              <p>📧 support@ayindetechnologies.com</p>
              <p>📞 1-302-208-4855</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <Link to="/services">Web Development</Link>
              <Link to="/services">AI Solutions</Link>
              <Link to="/services">Consulting</Link>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/about">Team</Link>
              <Link to="/contact-form">Contact</Link>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <Link to="/">Blog</Link>
              <Link to="/">Case Studies</Link>
              <Link to="/">Documentation</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Ayinde Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}