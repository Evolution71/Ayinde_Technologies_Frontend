import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SERVICE_LINKS = [
  { to: '/website-development', label: 'Website Development' },
  { to: '/app-development', label: 'App Development' },
  { to: '/tech-consulting', label: 'Tech Consulting' },
  { to: '/premium-services', label: 'Premium Services' },
];

// Hover opens the Services menu only on devices with a real mouse.
const canHover = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close everything whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Click outside or Escape closes the open menus.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Subtle shadow once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleServicesEnter = () => {
    if (canHover()) setServicesOpen(true);
  };
  const handleServicesLeave = () => {
    if (canHover()) setServicesOpen(false);
  };

  return (
    <header className={`ayn-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="ayn-nav__inner">
        <Link to="/" className="ayn-brand" aria-label="Ayinde Technologies, home">
          <img src="/ayinde-logo.png" alt="Ayinde Technologies" className="ayn-brand__logo" width="200" height="52" />
        </Link>

        <button
          type="button"
          className="ayn-toggle"
          aria-expanded={menuOpen}
          aria-controls="ayn-menu"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="ayn-menu" className={`ayn-menu${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <ul className="ayn-links">
            <li>
              <NavLink to="/about-us" className="ayn-link">About</NavLink>
            </li>

            <li
              className={`ayn-dropdown${servicesOpen ? ' is-open' : ''}`}
              ref={dropdownRef}
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                type="button"
                className="ayn-link ayn-link--button"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((open) => !open)}
              >
                Services <span className="ayn-caret" aria-hidden="true">▾</span>
              </button>
              <div className="ayn-dd" role="menu">
                {SERVICE_LINKS.map((item) => (
                  <Link key={item.to} to={item.to} className="ayn-dd__item" role="menuitem">
                    {item.label}
                  </Link>
                ))}
                <Link to="/our-services" className="ayn-dd__item ayn-dd__all" role="menuitem">
                  View All Services →
                </Link>
              </div>
            </li>

            <li>
              <NavLink to="/products" className="ayn-link">Products</NavLink>
            </li>
            <li>
              <NavLink to="/our-courses" className="ayn-link">Courses</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="ayn-link">Contact</NavLink>
            </li>
          </ul>

          <div className="ayn-actions">
            {user ? (
              <span className="ayn-user">
                Hi, {user.first_name}{' '}
                <button type="button" className="ayn-logout" onClick={logout}>
                  Log out
                </button>
              </span>
            ) : (
              <Link to="/login" className="ayn-btn ayn-btn--login">Login</Link>
            )}
            <Link to="/start-project" className="ayn-btn ayn-btn--cta">Start Project →</Link>
          </div>
        </nav>
      </div>

      <style>{`
        .ayn-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          border-bottom: 1px solid #e6eaf2;
          transition: box-shadow 0.3s ease;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }
        .ayn-nav.is-scrolled { box-shadow: 0 6px 24px rgba(10, 34, 72, 0.08); }

        .ayn-nav__inner {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Brand: the official logo from the Ayinde flier */
        .ayn-brand {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          min-width: 0;
        }
        .ayn-brand__logo {
          display: block;
          height: 52px;
          width: auto;
          max-width: 100%;
        }

        /* Desktop menu */
        .ayn-menu {
          display: flex;
          align-items: center;
          gap: 28px;
          margin-left: auto;
        }
        .ayn-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .ayn-link {
          position: relative;
          display: inline-block;
          padding: 6px 0;
          background: none;
          border: 0;
          font: inherit;
          font-size: 15px;
          font-weight: 600;
          color: #0A2248;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .ayn-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: #FF7A1A;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .ayn-link:hover,
        .ayn-link.active,
        .ayn-dropdown.is-open > .ayn-link { color: #2F9BFF; }
        .ayn-link:hover::after,
        .ayn-link.active::after { transform: scaleX(1); }
        .ayn-caret { font-size: 12px; margin-left: 2px; }

        /* Services dropdown */
        .ayn-dropdown { position: relative; }
        .ayn-dd {
          display: none;
          position: absolute;
          top: 100%;
          left: -14px;
          min-width: 260px;
          margin-top: 14px;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #e6eaf2;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(10, 34, 72, 0.14);
        }
        .ayn-dropdown.is-open .ayn-dd { display: block; }
        .ayn-dd__item {
          display: block;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #0A2248;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .ayn-dd__item:hover { background: #EEF5FF; color: #2F9BFF; }
        .ayn-dd__all {
          margin-top: 6px;
          border-top: 1px solid #e6eaf2;
          border-radius: 0 0 10px 10px;
          color: #2F9BFF;
        }

        /* Actions */
        .ayn-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ayn-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 22px;
          border-radius: 999px;
          border: 2px solid transparent;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .ayn-btn:hover { transform: translateY(-2px); }
        .ayn-btn--login { background: #FF7A1A; color: #ffffff; }
        .ayn-btn--login:hover { background: #E96A10; color: #ffffff; }
        .ayn-btn--cta { background: #0A2248; color: #ffffff; }
        .ayn-btn--cta:hover { background: #16386F; color: #ffffff; }
        .ayn-user { font-size: 14px; font-weight: 600; color: #0A2248; }
        .ayn-logout {
          background: none;
          border: 0;
          padding: 0;
          font: inherit;
          font-weight: 700;
          color: #2F9BFF;
          cursor: pointer;
        }

        /* Mobile toggle (hidden on desktop) */
        .ayn-toggle {
          display: none;
          width: 44px;
          height: 44px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: #ffffff;
          border: 1px solid #e6eaf2;
          border-radius: 12px;
          cursor: pointer;
          flex: 0 0 auto;
        }
        .ayn-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: #0A2248;
        }
        .ayn-toggle:focus-visible,
        .ayn-link:focus-visible,
        .ayn-dd__item:focus-visible,
        .ayn-btn:focus-visible,
        .ayn-brand:focus-visible {
          outline: 3px solid #2F9BFF;
          outline-offset: 3px;
          border-radius: 8px;
        }

        /* Tablet and phone */
        @media (max-width: 991.98px) {
          .ayn-nav__inner { min-height: 68px; }
          .ayn-toggle { display: inline-flex; }
          .ayn-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            max-height: calc(100vh - 68px);
            overflow-y: auto;
            margin: 0;
            padding: 8px 20px 24px;
            background: #ffffff;
            border-bottom: 1px solid #e6eaf2;
            box-shadow: 0 18px 40px rgba(10, 34, 72, 0.12);
          }
          .ayn-menu.is-open { display: flex; }
          .ayn-links {
            flex-direction: column;
            align-items: stretch;
            gap: 0;
          }
          .ayn-links > li { border-bottom: 0; }
          .ayn-link {
            display: block;
            width: 100%;
            padding: 11px 0;
            text-align: left;
            font-size: 16px;
            font-weight: 500;
            color: #1f2a44;
          }
          .ayn-link::after { display: none; }
          .ayn-dd {
            position: static;
            display: none;
            min-width: 0;
            margin: 0 0 8px;
            padding: 0 0 0 12px;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }
          .ayn-dropdown.is-open .ayn-dd { display: block; }
          .ayn-dd__all { border-top: 0; margin-top: 0; }
          .ayn-actions {
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            padding-top: 14px;
          }
          .ayn-btn { width: auto; min-width: 96px; height: 46px; padding: 0 20px; }
          .ayn-user { width: 100%; text-align: left; }
        }

        @media (min-width: 992px) {
          .ayn-menu { display: flex !important; }
        }

        @media (max-width: 380px) {
          .ayn-brand__logo { height: 44px; }
        }
      `}</style>
    </header>
  );
};

export default Navigation;
