import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo-white.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src={logoWhite} alt="Ayinde Technologies" className="footer-logo-img" />
            <p>Guide, Build &amp; Implement AI Technologies</p>
            <p className="footer-address">
              112 S Market St, Suite 1008<br />
              Inglewood, CA 90301<br />
              United States
            </p>
            <p className="footer-phone"><a href="tel:+19496627869">+1 949-662-7869</a></p>
          </div>
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="/#services">AI App Development</a></li>
              <li><a href="/#services">Web Development</a></li>
              <li><a href="/#services">Tech Consulting</a></li>
              <li><a href="/#courses">Online Courses</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="/#projects">Projects</a></li>
              <li><a href="/#team">Team</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">Twitter</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Ayinde Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;