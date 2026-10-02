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
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
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
              Services ▼
            </button>
            {servicesDropdown && (
              <div className="dropdown-menu">
                <Link to="/services/website" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  🌐 Website Development
                </Link>
                <Link to="/services/applications" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  📱 App Development
                </Link>
                <Link to="/services/consultation" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  💡 Tech Consultation
                </Link>
                <Link to="/services/premium" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  👑 Premium Services
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
              📚 Courses ▼
            </button>
            {coursesDropdown && (
              <div className="dropdown-menu">
                <Link to="/courses" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  Browse All Courses
                </Link>
                <Link to="/achievements" className="dropdown-item" onClick={() => handleDropdownSelect(() => setIsOpen(false))}>
                  🏆 Achievements
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
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 200px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          padding: 5px 0;
          margin-top: 5px;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: block;
          padding: 10px 20px;
          color: #333;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        @media (max-width: 768px) {
          .dropdown-menu {
            position: static;
            display: none;
            box-shadow: none;
            border-top: 1px solid #ddd;
            border-bottom: none;
            border-left: none;
            border-right: none;
            border-radius: 0;
            background: #f9f9f9;
            margin-top: 0;
            animation: none;
          }

          .nav-dropdown.active .dropdown-menu {
            display: block;
          }

          .dropdown-item {
            padding: 15px 20px;
            font-size: 15px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;