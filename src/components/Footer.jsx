import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo-white.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #182d52 100%);
          color: white;
          padding: 60px 20px 30px;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }

        .footer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(191, 144, 0, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 50px;
          margin-bottom: 50px;
        }

        .footer-section {
          animation: fadeInUp 0.8s ease-out;
        }

        .footer-section:nth-child(1) { animation-delay: 0.1s; }
        .footer-section:nth-child(2) { animation-delay: 0.2s; }
        .footer-section:nth-child(3) { animation-delay: 0.3s; }
        .footer-section:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-logo-img {
          max-height: 50px;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }

        .footer-section:hover .footer-logo-img {
          transform: scale(1.05);
        }

        .footer-section p {
          opacity: 1;
          line-height: 1.8;
          margin: 10px 0;
          font-size: 14px;
          transition: opacity 0.3s ease;
        }

        .footer-section:hover p {
          opacity: 1;
        }

        .footer-address {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #fbbf24;
          transition: all 0.3s ease;
        }

        .footer-address:hover {
          background: rgba(255, 255, 255, 0.15);
          border-left-color: #ff6b35;
          transform: translateX(5px);
        }

        .footer-section h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-section h4::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #fbbf24, #ff6b35);
          transition: width 0.4s ease;
        }

        .footer-section:hover h4::after {
          width: 40px;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section li {
          margin-bottom: 12px;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .footer-section li:hover {
          opacity: 1;
          transform: translateX(5px);
        }

        .footer-section a {
          color: white;
          text-decoration: none;
          position: relative;
          display: inline-block;
          font-size: 14px;
        }

        .footer-section a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #fbbf24, #ff6b35);
          transition: width 0.3s ease;
        }

        .footer-section a:hover::after {
          width: 100%;
        }

        .footer-phone a {
          font-weight: 600;
          font-size: 15px;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .social-icon:hover {
          background: linear-gradient(135deg, #fbbf24, #ff6b35);
          border-color: transparent;
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
          text-align: center;
          opacity: 1;
          animation: fadeIn 1s ease-out 0.6s both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .footer-bottom p {
          margin: 0;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .footer-bottom p:hover {
          opacity: 1;
          color: #fbbf24;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 40px 20px 20px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footer-section h4::after {
            width: 30px;
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>

      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src={logoWhite} alt="Ayinde Technologies" className="footer-logo-img" />
            <p>Guide, Build &amp; Implement AI Technologies</p>
            <p className="footer-address">
              📍 Delaware, USA
            </p>
            <p className="footer-phone"><a href="tel:+13022084855">📞 1-302-208-4855</a></p>
          </div>
          <div className="footer-section">
            <h4>🌐 Services</h4>
            <ul>
              <li><a href="/#services">AI App Development</a></li>
              <li><a href="/#services">Web Development</a></li>
              <li><a href="/#services">Tech Consulting</a></li>
              <li><a href="/#courses">Online Courses</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>🏢 Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="/#projects">Projects</a></li>
              <li><a href="/#team">Team</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>⚖️ Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">in</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">𝕏</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">f</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Ayinde Technologies. All rights reserved.</p>
          <p>🔒 Trusted by businesses across the globe to deliver technology that works.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;