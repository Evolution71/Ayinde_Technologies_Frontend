import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import VideoBackground from '../components/VideoBackground';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);

  // Scroll to hash on mount or when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Fetch interspersed team members from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ NEW: Use interspersed team members (male and female alternating)
        const response = await api.getInterspersedTeamMembers();
        console.log('[Home] Interspersed team response:', response);

        setTeamMembers(response);
        console.log('[Home] Loaded interspersed team members:', response.length);

      } catch (err) {
        console.error('[Home] Error fetching team:', err);
        setError(err.message);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // Load NextivaCX widget on demand
  const openChat = () => {
    // Load NextivaCX widget script
    if (!document.getElementById('nextivacx-code-snippet')) {
      const script = document.createElement('script');
      script.id = 'nextivacx-code-snippet';
      script.src = 'https://d3po7etsbw5eiv.cloudfront.net/Simplify360Chat.js?key=NmFjNTAyYTgxODk3OWMxODM2NjllNzY0fDQzNDYyMzg=';
      document.body.appendChild(script);
    }

    // Trigger the chat widget to open
    setTimeout(() => {
      if (window.simplify360Chat) {
        window.simplify360Chat.open();
      }
    }, 500);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero carousel images (using gradient overlays with icons for now)
  const heroImages = [
    {
      gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      icon: '🌐'
    },
    {
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      icon: '💻'
    },
    {
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      icon: '🚀'
    }
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* ========== HERO SECTION WITH VIDEO BACKGROUND ========== */}
      <VideoBackground minHeight="600px">
        {/* Floating Icon */}
        <div
          className="video-bg-accent"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '120px',
            zIndex: 0
          }}
        >
          {heroImages[currentImageIndex].icon}
        </div>

        {/* Carousel Navigation Dots */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            display: 'flex',
            gap: '12px',
            zIndex: 10
          }}
        >
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentImageIndex ? '#fbbf24' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <h1 className="video-bg-title" style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            marginBottom: '20px',
            fontWeight: '700',
            lineHeight: '1.2',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            Technology That Helps Your Business Grow
          </h1>

          <p className="video-bg-subtitle" style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            marginBottom: '40px',
            maxWidth: '800px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            lineHeight: '1.6'
          }}>
            We build websites, software and digital solutions that solve real business problems.
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'slideInUp 0.8s ease-out 0.4s both'
          }}>
            <button
              onClick={() => navigate('/services')}
              style={{
                padding: '16px 36px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#1e40af',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
              }}
            >
              Book a Free Consultation
            </button>
            <button
              onClick={() => navigate('/courses')}
              style={{
                padding: '16px 36px',
                fontSize: '16px',
                backgroundColor: '#fbbf24',
                color: '#1e40af',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
              }}
            >
              View Our Courses
            </button>
          </div>
        </div>
      </VideoBackground>

      {/* ========== VALUE PROPOSITION ========== */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', fontWeight: 'bold' }}>
          Your Business Deserves Technology That Works for You
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }}
        >
          {[
            {
              icon: '🌐',
              title: 'Websites That Do More Than Look Good',
              shortDesc: 'Your website is often the first interaction a potential customer has with your business.',
              services: ['Corporate websites', 'Business websites', 'Landing pages', 'E-commerce websites', 'Web portals'],
              buttonText: 'Build My Website →',
              link: '/services/website'
            },
            {
              icon: '💻',
              title: 'Custom Software & Web Applications',
              shortDesc: 'Off-the-shelf software doesn\'t always fit the way your business operates.',
              services: ['Business management systems', 'Customer portals', 'Booking systems', 'CRM solutions', 'Custom web applications'],
              buttonText: 'Discuss My Software Project →',
              link: '/services/applications'
            },
            {
              icon: '📱',
              title: 'Mobile Applications',
              shortDesc: 'Transform your ideas into intuitive, reliable mobile experiences.',
              services: ['iOS & Android Apps', 'React Native Development', 'MVP Development', 'App Strategy'],
              buttonText: 'Build My App →',
              link: '/services/applications'
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
                onClick={() => navigate(service.link)}
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
            gridTemplateColumns: 'repeat(3, 1fr)',
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
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

      {/* ========== QUOTES SECTION ========== */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '36px', fontWeight: 'bold' }}>
          💬 Inspiration from Industry Leaders
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px', fontSize: '16px' }}>
          Wisdom and insights from tech visionaries to inspire your journey
        </p>

        <div style={{
          backgroundColor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '40px',
          borderLeft: '5px solid #3b82f6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💡</div>
          <blockquote style={{
            fontSize: '22px',
            fontStyle: 'italic',
            color: '#1f2937',
            marginBottom: '20px',
            maxWidth: '800px',
            margin: '0 auto 20px',
            fontWeight: '500',
            lineHeight: '1.6'
          }}>
            "Innovation distinguishes between a leader and a follower."
          </blockquote>
          <p style={{ color: '#374151', fontWeight: 'bold', marginBottom: '5px' }}>
            — Steve Jobs
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Apple Co-founder
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
          {[
            {
              icon: '❤️',
              quote: 'The only way to do great work is to love what you do.',
              author: 'Steve Jobs',
              title: 'Apple Co-founder'
            },
            {
              icon: '🚀',
              quote: 'The only impossible journey is the one you never begin.',
              author: 'Tony Robbins',
              title: 'Motivational Speaker'
            },
            {
              icon: '⚙️',
              quote: 'Ideas are nothing. Execution is everything.',
              author: 'Mark Zuckerberg',
              title: 'Facebook Founder'
            }
          ].map((item, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: '5px solid #3b82f6',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '32px', marginBottom: '15px' }}>{item.icon}</div>
              <p style={{
                fontSize: '15px',
                fontStyle: 'italic',
                color: '#374151',
                marginBottom: '15px',
                lineHeight: '1.5'
              }}>
                "{item.quote}"
              </p>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                <p style={{ margin: '0 0 3px 0', color: '#1f2937', fontWeight: 'bold', fontSize: '14px' }}>
                  — {item.author}
                </p>
                <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/quotes')}
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            View All Quotes & Categories →
          </button>
        </div>
      </div>

      {/* ========== TEAM ========== */}
      <div id="team" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Our Team
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
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
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>{member.image || '👤'}</div>
                <h3 style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold' }}>
                  {member.name}
                </h3>
                <p style={{ color: '#1e40af', marginBottom: '10px', fontWeight: '500' }}>
                  {member.title}
                </p>
                {member.quote && (
                  <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
                    "{member.quote}"
                  </p>
                )}
              </div>
            ))
          ) : loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#999' }}>Loading team members...</p>
            </div>
          ) : error ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#d32f2f' }}>Error loading team: {error}</p>
            </div>
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#999' }}>Team members will appear here once added to the backend.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========== CTA ========== */}
      <div id="contact" style={{ maxWidth: '900px', margin: '50px auto', padding: '30px', backgroundColor: '#f0f9ff', borderRadius: '8px', textAlign: 'center', scrollMarginTop: '80px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: 'bold' }}>
          Ready to Get Started?
        </h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
          Connect with our team or explore our services.
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
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1e3a8a';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1e40af';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Book a Free Consultation
          </button>
          <button
            onClick={openChat}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff5722';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff6b35';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            💬 Chat with us
          </button>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '40px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '40px' }}>
          {/* Company Info */}
          <div>
            <h3 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: 'bold' }}>
              Ayinde Technologies
            </h3>
            <p style={{ opacity: 1, lineHeight: '1.6' }}>
              Building practical digital solutions for businesses ready to grow.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }}>
              Sales & Support
            </h4>
            <p style={{ marginBottom: '8px' }}>
              📞 <strong>+1 302-208-4855</strong>
            </p>
            <p style={{ marginBottom: '8px' }}>
              📧 <strong>support@ayindetechnologies.com</strong>
            </p>
            <p style={{ marginBottom: '8px', fontSize: '12px', opacity: 1 }}>
              📍 <strong>East Coast Headquarters:</strong><br/>
              Delaware, USA
            </p>
            <p style={{ marginBottom: '0', fontSize: '12px', opacity: 1 }}>
              📍 <strong>Westcoast Division:</strong><br/>
              California, USA
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#services" style={{ color: '#fff', textDecoration: 'none', opacity: 1, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  🌐 Services
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#team" style={{ color: '#fff', textDecoration: 'none', opacity: 1, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  👥 Our Team
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#contact" style={{ color: '#fff', textDecoration: 'none', opacity: 1, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  📝 Contact
                </a>
              </li>
              <li>
                <a href="/courses" style={{ color: '#fff', textDecoration: 'none', opacity: 1, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                  📖 Courses
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px', textAlign: 'center', opacity: 1, fontSize: '13px' }}>
          <p style={{ margin: 0 }}>
            © 2026 Ayinde Technologies Limited. All rights reserved.
          </p>
          <p style={{ margin: '8px 0 0 0' }}>
            🔒 Trusted by businesses across the globe to deliver technology that works.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;