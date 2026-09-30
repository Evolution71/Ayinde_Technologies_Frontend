import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

// Section links only make sense on the home page. From another page, they
// navigate home first, then the hash takes over (see Home.jsx's scroll effect).
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" className="nav-link" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/services/website" className="nav-link" onClick={() => setIsOpen(false)}>🌐 Websites</Link>
          <Link to="/services/applications" className="nav-link" onClick={() => setIsOpen(false)}>📱 Applications</Link>
          <Link to="/services/consultation" className="nav-link" onClick={() => setIsOpen(false)}>💡 Consultation</Link>
          <Link to="/services/premium" className="nav-link" onClick={() => setIsOpen(false)}>👑 Premium</Link>
          <Link to="/courses" className="nav-link" onClick={() => setIsOpen(false)}>Courses</Link>
          <Link to="/achievements" className="nav-link" onClick={() => setIsOpen(false)}>🏆 Achievements</Link>
          <Link to="/quotes" className="nav-link" onClick={() => setIsOpen(false)}>💬 Quotes</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About Us</Link>
          <a href={sectionHref('#contact')} className="nav-link contact-btn" onClick={() => setIsOpen(false)}>Contact Us</a>
          {user ? (
            <span className="nav-user">
              Hi, {user.first_name} · <button className="link-btn" onClick={logout}>Log out</button>
            </span>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Log in</Link>
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
    </nav>
  );
};

export default Navigation;