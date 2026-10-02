import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  // Scroll to hash on mount or when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Fetch team members from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const team = await api.get('/api/team/');
        setTeamMembers(Array.isArray(team) ? team : team.team || []);
      } catch (err) {
        console.error('Error fetching team:', err);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* ========== HERO SECTION ========== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          padding: '80px 40px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
          Technology That Helps Your Business Grow
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '20px', opacity: 0.9, maxWidth: '800px', margin: '0 auto 20px' }}>
          We build websites, software and digital solutions that solve real business problems.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/services')}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Book a Free Consultation
          </button>
          <button
            onClick={() => navigate('/courses')}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#fbbf24',
              color: '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            View Our Courses
          </button>
        </div>
      </div>

      {/* ========== VALUE PROPOSITION ========== */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', fontWeight: 'bold' }}>
          Your Business Deserves Technology That Works for You
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}
        >
          {[
            {
              icon: '👥',
              title: 'Attract more customers',
              desc: 'Build a professional digital presence that turns visitors into enquiries and customers.'
            },
            {
              icon: '⏱️',
              title: 'Save time and reduce manual work',
              desc: 'Replace repetitive processes with smarter digital systems and automation.'
            },
            {
              icon: '😊',
              title: 'Deliver better customer experiences',
              desc: 'Give your customers faster, easier and more convenient ways to interact with your business.'
            },
            {
              icon: '📈',
              title: 'Scale with confidence',
              desc: 'Build technology that can grow alongside your business instead of holding it back.'
            }
          ].map((value, i) => (
            <div key={i}
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{value.icon}</div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>{value.title}</h3>
              <p style={{ color: '#666' }}>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SERVICES SECTION ========== */}
      <div id="services" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', fontWeight: 'bold' }}>
          What We Build
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}
        >
          {[
            {
              icon: '🌐',
              title: 'Websites That Do More Than Look Good',
              shortDesc: 'Your website is often the first interaction a potential customer has with your business.',
              services: ['Corporate websites', 'Business websites', 'Landing pages', 'E-commerce websites', 'Web portals'],
              buttonText: 'Build My Website →'
            },
            {
              icon: '💻',
              title: 'Custom Software & Web Applications',
              shortDesc: 'Off-the-shelf software doesn\'t always fit the way your business operates.',
              services: ['Business management systems', 'Customer portals', 'Booking systems', 'CRM solutions', 'Custom web applications'],
              buttonText: 'Discuss My Software Project →'
            },
            {
              icon: '📱',
              title: 'Mobile Applications',
              shortDesc: 'Transform your ideas into intuitive, reliable mobile experiences.',
              services: ['iOS & Android Apps', 'React Native Development', 'MVP Development', 'App Strategy'],
              buttonText: 'Build My App →'
            }
          ].map((service, i) => (
            <div key={i}
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>{service.icon}</div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>{service.title}</h3>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>{service.shortDesc}</p>
              
              <div style={{ marginBottom: '20px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
                  {service.services.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {service.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========== PROCESS SECTION ========== */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', fontWeight: 'bold' }}>
          From Challenge to Working Solution
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}
        >
          {[
            { number: '01', title: 'Discover', desc: 'Understand your business and goals' },
            { number: '02', title: 'Plan', desc: 'Define scope and roadmap' },
            { number: '03', title: 'Design', desc: 'Create UX and visual direction' },
            { number: '04', title: 'Build', desc: 'Develop with regular communication' },
            { number: '05', title: 'Launch', desc: 'Deploy and verify' },
            { number: '06', title: 'Support', desc: 'Maintenance and improvements' }
          ].map((step, i) => (
            <div key={i}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
                {step.number}
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>{step.title}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== WHY US ========== */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', fontWeight: 'bold' }}>
          Why Work With Ayinde Technologies?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { title: 'We Listen Before We Build', desc: 'We understand the problem before recommending solutions.' },
            { title: 'We Build for Your Needs', desc: 'Your business is different. Your technology should be too.' },
            { title: 'We Communicate Clearly', desc: 'You don\'t need to be a developer to understand progress.' },
            { title: 'We Focus on Results', desc: 'We create solutions that deliver real value to your business.' },
            { title: 'We Think Beyond Launch', desc: 'We provide ongoing support, maintenance and improvements.' }
          ].map((reason, i) => (
            <div key={i}
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{reason.title}</h3>
              <p style={{ color: '#666' }}>{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== TEAM ========== */}
      <div id="team" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Our Team
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {!loading && teamMembers.length > 0 ? (
            teamMembers.map((member, i) => (
              <div key={i}
                style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>👤</div>
                <h3 style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold' }}>
                  {member.name}
                </h3>
                <p style={{ color: '#1e40af', marginBottom: '10px', fontWeight: '500' }}>
                  {member.role}
                </p>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p>Loading team members...</p>
            </div>
          )}
        </div>
      </div>

      {/* ========== CTA ========== */}
      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '40px', backgroundColor: '#f0f9ff', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '32px', fontWeight: 'bold' }}>
          Have a Business Challenge We Can Solve?
        </h2>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
          Let's turn your idea into technology that works.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/services')}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Book a Free Consultation
          </button>
          <a
            href="https://wa.me/yourwhatsappnumber"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#25d366',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '40px', textAlign: 'center', marginTop: '60px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Ayinde Technologies
        </h3>
        <p style={{ marginBottom: '10px' }}>
          Building practical digital solutions for businesses ready to grow.
        </p>
      </div>
    </div>
  );
};

export default Home;