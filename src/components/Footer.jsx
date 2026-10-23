import React from 'react';
import { Link } from 'react-router-dom';

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ayinde-technologies/' },
  { label: 'Instagram', href: 'https://www.instagram.com/ayindetechnologies' },
  { label: 'X', href: 'https://x.com/ayindetechhq' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@ayindetechnologies' },
  { label: 'YouTube', href: 'https://youtube.com/@AyindeTechnologies' },
];

const SERVICE_LINKS = [
  { to: '/app-development', label: 'App Development' },
  { to: '/website-development', label: 'Website Development' },
  { to: '/tech-consulting', label: 'Tech Consulting' },
  { to: '/premium-services', label: 'Premium Services' },
  { to: '/our-courses', label: 'Online Courses' },
];

const COMPANY_LINKS = [
  { to: '/about-us', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/#team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
  { to: '/start-project', label: 'Start a Project' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="ayn-footer">
      <div className="ayn-footer__inner">
        <div className="ayn-footer__grid">
          <div className="ayn-footer__col ayn-footer__brand">
            <Link to="/" className="ayn-brand" aria-label="Ayinde Technologies Corporation, home">
              <span className="ayn-mark" aria-hidden="true">
                <span className="ayn-mark__left" />
                <span className="ayn-mark__right" />
                <span className="ayn-mark__dot" />
              </span>
              <span className="ayn-brand__text">
                <span className="ayn-brand__name">AYINDE</span>
                <span className="ayn-brand__sub">Technologies Corporation</span>
              </span>
            </Link>
            <p className="ayn-footer__tagline">Guide, Build &amp; Implement AI Technologies</p>
            <ul className="ayn-footer__offices">
              <li>
                <span className="ayn-footer__label">East Coast HQ</span>
                254 Chapman Rd, Ste. 208, Newark, DE 19702
              </li>
              <li>
                <span className="ayn-footer__label">West Coast Office</span>
                112 S Market St, Ste. 1008, Inglewood, CA 90301
              </li>
            </ul>
          </div>

          <div className="ayn-footer__col">
            <h4 className="ayn-footer__heading">Talk to us</h4>
            <ul className="ayn-footer__list">
              <li>
                <span className="ayn-footer__label">Sales · Sophia</span>
                <a href="tel:+13025150227">+1-302-515-0227</a>
                <a href="mailto:sales@ayindetechnologies.com">sales@ayindetechnologies.com</a>
              </li>
              <li>
                <span className="ayn-footer__label">Support · Peter</span>
                <a href="tel:+12015342657">+1-201-534-2657</a>
                <a href="mailto:support@ayindetechnologies.com">support@ayindetechnologies.com</a>
              </li>
              <li>
                <span className="ayn-footer__label">General enquiries</span>
                <a href="mailto:info@ayindetechnologies.com">info@ayindetechnologies.com</a>
              </li>
            </ul>
          </div>

          <div className="ayn-footer__col">
            <h4 className="ayn-footer__heading">Services</h4>
            <ul className="ayn-footer__list ayn-footer__list--links">
              {SERVICE_LINKS.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="ayn-footer__col">
            <h4 className="ayn-footer__heading">Company</h4>
            <ul className="ayn-footer__list ayn-footer__list--links">
              {COMPANY_LINKS.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ayn-footer__social" aria-label="Social media">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ayn-footer__pill"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="ayn-footer__bottom">
          <p>© {year} Ayinde Technologies Corporation. All rights reserved.</p>
          <div className="ayn-footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        .ayn-footer {
          background: #0A2248;
          color: rgba(255, 255, 255, 0.82);
          padding: 64px 20px 28px;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }
        .ayn-footer__inner { max-width: 1280px; margin: 0 auto; }
        .ayn-footer__grid {
          display: grid;
          grid-template-columns: 1.3fr 1.2fr 0.9fr 0.9fr;
          gap: 40px;
        }
        .ayn-footer__col { min-width: 0; }
        .ayn-footer__heading {
          margin: 0 0 18px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FF7A1A;
        }
        .ayn-footer__tagline {
          margin: 18px 0 22px;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
        }
        .ayn-footer__offices { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; font-size: 14px; line-height: 1.6; }
        .ayn-footer__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; font-size: 14px; line-height: 1.5; }
        .ayn-footer__list--links { gap: 10px; }
        .ayn-footer__label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 2px;
        }
        .ayn-footer a {
          color: #ffffff;
          text-decoration: none;
          overflow-wrap: anywhere;
          transition: color 0.2s ease;
        }
        .ayn-footer__list a { display: block; }
        .ayn-footer a:hover { color: #2F9BFF; }
        .ayn-footer a:focus-visible { outline: 3px solid #2F9BFF; outline-offset: 3px; border-radius: 4px; }

        .ayn-footer .ayn-brand { display: flex; align-items: center; gap: 12px; color: #ffffff; }
        .ayn-footer .ayn-brand:hover { color: #ffffff; }
        .ayn-mark { position: relative; width: 40px; height: 40px; border-radius: 11px; background: #ffffff; flex: 0 0 auto; overflow: hidden; }
        .ayn-mark__left, .ayn-mark__right { position: absolute; bottom: 9px; width: 4px; height: 20px; border-radius: 2px; background: #2F9BFF; }
        .ayn-mark__left { left: 11px; transform: rotate(-22deg); transform-origin: bottom center; }
        .ayn-mark__right { right: 11px; transform: rotate(22deg); transform-origin: bottom center; background: #FF7A1A; }
        .ayn-mark__dot { position: absolute; top: 8px; left: 50%; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%; background: #FF7A1A; }
        .ayn-brand__name { display: block; font-size: 18px; font-weight: 800; letter-spacing: 0.1em; line-height: 1; }
        .ayn-brand__sub { display: block; margin-top: 5px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #2F9BFF; white-space: nowrap; }

        .ayn-footer__social { display: flex; flex-wrap: wrap; gap: 10px; margin: 48px 0 0; }
        .ayn-footer__pill {
          display: inline-flex;
          align-items: center;
          height: 38px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          font-size: 13px;
          font-weight: 700;
        }
        .ayn-footer__pill:hover { background: #FF7A1A; border-color: #FF7A1A; color: #ffffff; }

        .ayn-footer__bottom {
          margin-top: 36px;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px 24px;
          font-size: 13px;
        }
        .ayn-footer__bottom p { margin: 0; color: rgba(255, 255, 255, 0.6); }
        .ayn-footer__legal { display: flex; flex-wrap: wrap; gap: 20px; }
        .ayn-footer__legal a { font-weight: 600; }

        @media (max-width: 991.98px) {
          .ayn-footer__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px 28px; }
          .ayn-footer__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .ayn-footer { padding: 48px 16px 24px; }
          .ayn-footer__grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .ayn-footer__brand { grid-column: auto; }
          .ayn-footer__social { margin-top: 36px; }
          .ayn-footer__pill { flex: 1 1 calc(50% - 10px); justify-content: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;