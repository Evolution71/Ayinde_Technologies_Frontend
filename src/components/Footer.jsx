import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo-white.svg';

const SOCIALS = [
  { href: 'https://www.linkedin.com/company/ayinde-technologies/', label: 'LinkedIn', text: 'in' },
  { href: 'https://www.instagram.com/ayindetechnologies', label: 'Instagram', text: 'IG' },
  { href: 'https://x.com/ayindetechhq', label: 'X', text: '𝕏' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ayn-footer">
      <style>{`
        /* All classes are prefixed "ayn-" so Bootstrap (loaded on the design
           pages) can't override the footer layout. */
        .ayn-footer {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #182d52 100%);
          color: #fff;
          padding: 64px 24px 28px;
          position: relative;
          overflow: hidden;
          font-size: 14px;
        }

        .ayn-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }

        .ayn-footer::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 30%, rgba(59,130,246,0.12) 0%, transparent 50%),
            radial-gradient(circle at 85% 85%, rgba(251,191,36,0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .ayn-footer-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* ---------- Row 1: brand + link columns ---------- */
        .ayn-footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 48px;
          align-items: start;
          padding-bottom: 44px;
        }

        .ayn-footer-logo {
          display: block;
          height: 48px;
          width: auto;
          margin: 0 0 16px;
        }

        .ayn-footer-tagline {
          margin: 0 0 22px;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
          max-width: 300px;
        }

        .ayn-footer-heading {
          margin: 0 0 18px;
          padding-bottom: 10px;
          font-size: 16px;
          font-weight: 800;
          color: #fbbf24;
          position: relative;
        }

        .ayn-footer-heading::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 32px; height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #fbbf24, #ff6b35);
        }

        .ayn-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .ayn-footer-links li {
          margin: 0 0 12px;
        }

        .ayn-footer a {
          color: #fff;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .ayn-footer a:hover {
          color: #fbbf24;
        }

        .ayn-footer-links a {
          display: inline-block;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .ayn-footer-links a:hover {
          transform: translateX(4px);
        }

        /* ---------- Social icons ---------- */
        .ayn-social {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ayn-social a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 13px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .ayn-social a:hover {
          color: #fff;
          background: linear-gradient(135deg, #fbbf24, #ff6b35);
          border-color: transparent;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255,107,53,0.3);
        }

        /* ---------- Row 2: contact cards ---------- */
        .ayn-footer-contact {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          padding: 32px 0;
          border-top: 1px solid rgba(255,255,255,0.15);
        }

        .ayn-contact-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-left: 4px solid #fbbf24;
          border-radius: 10px;
          padding: 16px 18px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .ayn-contact-card:hover {
          background: rgba(255,255,255,0.11);
          border-left-color: #ff6b35;
        }

        .ayn-contact-title {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #fbbf24;
        }

        .ayn-contact-card p {
          margin: 0 0 6px;
          line-height: 1.55;
          color: rgba(255,255,255,0.9);
        }

        .ayn-contact-card p:last-child {
          margin-bottom: 0;
        }

        .ayn-contact-name {
          font-weight: 700;
          color: #fff !important;
        }

        .ayn-contact-card a {
          font-weight: 600;
          word-break: break-word;
        }

        /* ---------- Row 3: bottom bar ---------- */
        .ayn-footer-bottom {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.15);
          font-size: 13px;
        }

        .ayn-footer-bottom p {
          margin: 0;
          color: rgba(255,255,255,0.8);
        }

        .ayn-footer-legal {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ayn-footer-legal a {
          font-weight: 600;
        }

        .ayn-footer-legal span {
          opacity: 0.5;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px) {
          .ayn-footer-contact {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .ayn-footer-top {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 32px;
          }

          .ayn-footer-brand {
            grid-column: 1 / -1;
          }

          .ayn-footer-tagline {
            max-width: none;
          }
        }

        @media (max-width: 600px) {
          .ayn-footer {
            padding: 44px 16px 24px;
          }

          .ayn-footer-top {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 28px;
          }

          .ayn-footer-contact {
            grid-template-columns: minmax(0, 1fr);
          }

          .ayn-footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <div className="ayn-footer-inner">
        {/* Row 1: brand + links */}
        <div className="ayn-footer-top">
          <div className="ayn-footer-brand">
            <img src={logoWhite} alt="Ayinde Technologies" className="ayn-footer-logo" />
            <p className="ayn-footer-tagline">Guide, Build &amp; Implement AI Technologies</p>
            <div className="ayn-social">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.text}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="ayn-footer-heading">🌐 Services</h4>
            <ul className="ayn-footer-links">
              <li><Link to="/app-development">AI App Development</Link></li>
              <li><Link to="/website-development">Web Development</Link></li>
              <li><Link to="/tech-consulting">Tech Consulting</Link></li>
              <li><Link to="/premium-services">Premium Services</Link></li>
              <li><Link to="/our-courses">Online Courses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="ayn-footer-heading">🏢 Company</h4>
            <ul className="ayn-footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><a href="/#projects">Projects</a></li>
              <li><a href="/#team">Team</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ayn-footer-heading">⚖️ Legal</h4>
            <ul className="ayn-footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Row 2: contact details */}
        <div className="ayn-footer-contact">
          <div className="ayn-contact-card">
            <h5 className="ayn-contact-title">📍 Offices</h5>
            <p><span className="ayn-contact-name">East Coast HQ</span><br />254 Chapman Rd, Ste. 208, Newark, DE 19702</p>
            <p><span className="ayn-contact-name">West Coast</span><br />112 S Market St, Ste. 1008, Inglewood, CA 90301</p>
          </div>

          <div className="ayn-contact-card">
            <h5 className="ayn-contact-title">💼 Sales</h5>
            <p className="ayn-contact-name">Sophia</p>
            <p><a href="tel:+13025150227">+1 302 515 0227</a></p>
            <p><a href="mailto:sales@ayindetechnologies.com">sales@ayindetechnologies.com</a></p>
          </div>

          <div className="ayn-contact-card">
            <h5 className="ayn-contact-title">🛟 Support</h5>
            <p className="ayn-contact-name">Peter</p>
            <p><a href="tel:+12015342657">+1 201 534 2657</a></p>
            <p><a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a></p>
          </div>

          <div className="ayn-contact-card">
            <h5 className="ayn-contact-title">✉️ General Enquiries</h5>
            <p>Book a call or email us:</p>
            <p><a href="mailto:info@ayindetechnologies.com">info@ayindetechnologies.com</a></p>
          </div>
        </div>

        {/* Row 3: bottom bar */}
        <div className="ayn-footer-bottom">
          <p>&copy; {currentYear} Ayinde Technologies. All rights reserved.</p>
          <div className="ayn-footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;