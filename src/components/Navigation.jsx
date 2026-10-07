import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const onHome = location.pathname === '/';

  const sectionHref = (hash) => (onHome ? hash : `/${hash}`);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        setServicesDropdown(false);
        setCoursesDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdowns when navigating
  React.useEffect(() => {
    setServicesDropdown(false);
    setCoursesDropdown(false);
  }, [location]);

  const handleDropdownToggle = (e, dropdownType) => {
    e.preventDefault();
    if (dropdownType === 'services') {
      setServicesDropdown(!servicesDropdown);
      setCoursesDropdown(false);
    } else if (dropdownType === 'courses') {
      setCoursesDropdown(!coursesDropdown);
      setServicesDropdown(false);
    }
  };

  const handleDropdownSelect = (callback) => {
    callback();
    setServicesDropdown(false);
    setCoursesDropdown(false);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Ayinde Technologies" className="nav-logo-img" />
        </Link>
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link nav-home" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          {/* Services Dropdown */}
          <div className={`nav-dropdown ${servicesDropdown ? 'active' : ''}`}
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}>
            <button
              className="nav-link dropdown-toggle"
              onClick={(e) => handleDropdownToggle(e, 'services')}
              aria-expanded={servicesDropdown}
              aria-label="Services submenu">
              🌐 Services ▼
            </button>
            {servicesDropdown && (
              <div className="dropdown-menu services-menu">
                <Link to="/services/website" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  <span className="item-icon">🌐</span>
                  <span className="item-text">Website Development</span>
                </Link>
                <Link to="/services/applications" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  <span className="item-icon">📱</span>
                  <span className="item-text">App Development</span>
                </Link>
                <Link to="/services/consultation" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  <span className="item-icon">💬</span>
                  <span className="item-text">Tech Consultation</span>
                </Link>
                <Link to="/services/premium" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  <span className="item-icon">👑</span>
                  <span className="item-text">Premium Services</span>
                </Link>
              </div>
            )}
          </div>

          {/* Courses Dropdown */}
          <div className={`nav-dropdown ${coursesDropdown ? 'active' : ''}`}
            onMouseEnter={() => setCoursesDropdown(true)}
            onMouseLeave={() => setCoursesDropdown(false)}>
            <button
              className="nav-link dropdown-toggle"
              onClick={(e) => handleDropdownToggle(e, 'courses')}
              aria-expanded={coursesDropdown}
              aria-label="Courses submenu">
              📖 Courses ▼
            </button>
            {coursesDropdown && (
              <div className="dropdown-menu courses-menu">
                <Link to="/courses" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  <span className="item-icon">📖</span>
                  <span className="item-text">Browse All Courses</span>
                </Link>
                <Link to="/achievements" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  <span className="item-icon">🏆</span>
                  <span className="item-text">Achievements</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>
            About Us
          </Link>

          <Link to="/quotes" className="nav-link" onClick={() => setIsOpen(false)}>
            💬 Quotes
          </Link>

          <a href={sectionHref('#team')} className="nav-link" onClick={() => setIsOpen(false)}>
            Team
          </a>

          <a href={sectionHref('#contact')} className="nav-link contact-btn" onClick={() => setIsOpen(false)}>
            Contact
          </a>

          {user ? (
            <span className="nav-user">
              Hi, {user.first_name} · <button className="link-btn" onClick={logout}>Log out</button>
            </span>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
              Log in
            </Link>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      <style>{`
        .navbar {
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.98) 0%, rgba(25, 51, 140, 0.98) 100%);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 999;
          transition: all 0.3s ease;
        }

        .nav-logo-img {
          transition: transform 0.3s ease;
        }

        .nav-logo:hover .nav-logo-img {
          transform: scale(1.05);
        }

        .nav-link {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }

        .nav-link:hover {
          color: #fbbf24;
          transform: translateY(-2px);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -5px;
          left: 0;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .contact-btn {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          padding: 8px 20px !important;
          border-radius: 20px;
          color: white !important;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          transition: all 0.3s ease;
        }

        .contact-btn:hover {
          box-shadow: 0 6px 25px rgba(255, 107, 53, 0.5);
          transform: translateY(-3px);
        }

        .nav-dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-toggle {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
          color: inherit;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          min-width: 220px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          padding: 8px 0;
          margin-top: 10px;
          animation: slideDownMenu 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(20px);
        }

        @keyframes slideDownMenu {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #1f2937;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .dropdown-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(180deg, #fbbf24, #ff6b35);
          transform: scaleY(0);
          transition: transform 0.3s ease;
          transform-origin: center;
        }

        .dropdown-item:hover {
          background: linear-gradient(90deg, #f3f4f6, #ffffff);
          padding-left: 24px;
        }

        .dropdown-item:hover::before {
          transform: scaleY(1);
        }

        .item-icon {
          font-size: 18px;
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .dropdown-item:hover .item-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .item-text {
          flex: 1;
        }

        .hamburger {
          background: none;
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: none;
        }

        .hamburger:hover {
          transform: rotate(90deg);
        }

        @media (max-width: 768px) {
          .hamburger {
            display: block;
          }

          .dropdown-menu {
            position: static;
            display: none;
            box-shadow: none;
            border: none;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
            margin-top: 0;
            border-radius: 0;
            animation: slideInMobile 0.3s ease;
          }

          @keyframes slideInMobile {
            from {
              opacity: 0;
              max-height: 0;
            }
            to {
              opacity: 1;
              max-height: 500px;
            }
          }

          .nav-dropdown.active .dropdown-menu {
            display: block;
          }

          .dropdown-item {
            padding: 15px 20px;
            font-size: 15px;
          }

          .dropdown-item:hover {
            padding-left: 20px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;