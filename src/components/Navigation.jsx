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
          <div className="nav-dropdown" 
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}>
            <Link to="/services" className="nav-link">
              Services ▼
            </Link>
            {servicesDropdown && (
              <div className="dropdown-menu">
                <Link to="/services/website" className="dropdown-item" onClick={() => setIsOpen(false)}>
                  🌐 Website Development
                </Link>
                <Link to="/services/applications" className="dropdown-item" onClick={() => setIsOpen(false)}>
                  📱 App Development
                </Link>
                <Link to="/services/consultation" className="dropdown-item" onClick={() => setIsOpen(false)}>
                  💡 Tech Consultation
                </Link>
                <Link to="/services/premium" className="dropdown-item" onClick={() => setIsOpen(false)}>
                  👑 Premium Services
                </Link>
              </div>
            )}
          </div>

          {/* Courses Dropdown */}
          <div className="nav-dropdown"
            onMouseEnter={() => setCoursesDropdown(true)}
            onMouseLeave={() => setCoursesDropdown(false)}>
            <Link to="/courses" className="nav-link">
              📚 Courses ▼
            </Link>
            {coursesDropdown && (
              <div className="dropdown-menu">
                <Link to="/courses" className="dropdown-item" onClick={() => setIsOpen(false)}>
                  Browse All Courses
                </Link>
                <Link to="/achievements" className="dropdown-item" onClick={() => setIsOpen(false)}>
                  🏆 Achievements
                </Link>
              </div>
            )}
          </div>

          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>
            About Us
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
            border: none;
            background: #f9f9f9;
          }

          .nav-dropdown.active .dropdown-menu {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;