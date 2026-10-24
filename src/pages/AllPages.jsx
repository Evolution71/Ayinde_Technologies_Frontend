import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/site-base.css';

// Index of every design page (PHP design), reachable from the navbar.
const GROUPS = [
  {
    title: 'Company',
    pages: [
      { name: 'About Us', path: '/about-us', text: 'Our story, leadership and approach.' },
      { name: 'Our Services', path: '/our-services', text: 'Website, app, consulting and premium services.' },
      { name: 'Our Courses', path: '/our-courses', text: 'Masterclasses and learning paths.' },
      { name: 'Products', path: '/products', text: 'HR-Wise, Verus-POS, Exactus and Inventro.' },
      { name: 'Premium Services', path: '/premium-services', text: 'Enterprise-grade digital ecosystems.' },
      { name: 'Contact', path: '/contact', text: 'Talk to our sales and support teams.' },
      { name: 'Start Project', path: '/start-project', text: 'Tell us about your project.' },
      { name: 'Terms & Privacy', path: '/terms-and-conditions', text: 'Legal, privacy and service terms.' },
    ],
  },
  {
    title: 'Services',
    pages: [
      { name: 'Website Development', path: '/website-development', text: 'Websites that do more than look good.' },
      { name: 'App Development', path: '/app-development', text: 'Mobile and desktop applications.' },
      { name: 'Tech Consulting', path: '/tech-consulting', text: 'Plan before you build.' },
    ],
  },
  {
    title: 'Products',
    pages: [
      { name: 'HR-Wise', path: '/hr-wise', text: 'Smarter human resources.' },
      { name: 'Verus-POS', path: '/verus-pos', text: 'Next-generation point of sale.' },
      { name: 'Exactus', path: '/exactus', text: 'Payroll and accounting.' },
      { name: 'Inventro', path: '/inventro', text: 'Supply chain management.' },
    ],
  },
];

const AllPages = () => (
  <div className="ayinde-site" style={{ minHeight: '100vh', padding: '120px 20px 80px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 className="fw-bold text-center mb-2" style={{ color: '#0A2248', fontSize: 'clamp(28px, 4vw, 40px)' }}>All Pages</h1>
      <p className="text-center mb-5" style={{ color: '#666' }}>Explore every page of the Ayinde Technologies Corporation site.</p>
      {GROUPS.map((group) => (
        <section key={group.title} className="mb-5">
          <h2 className="fw-bold mb-4" style={{ color: '#0A2248', fontSize: 22 }}>{group.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {group.pages.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                style={{
                  display: 'block',
                  background: '#fff',
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: '0 16px 40px rgba(10,34,72,0.08)',
                  color: '#0A2248',
                  textDecoration: 'none',
                  borderLeft: '5px solid #2F9BFF',
                }}
              >
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>{p.name} →</div>
                <div style={{ color: '#666', fontSize: 14 }}>{p.text}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);

export default AllPages;
