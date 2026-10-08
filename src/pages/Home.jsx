import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';

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

  // Fetch team members from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the api client method
        const response = await api.getTeamMembers();
        console.log('[Home] Team response:', response);

        // Handle flexible response formats
        let teamData = [];
        if (Array.isArray(response)) {
          // Direct array response
          teamData = response;
        } else if (response?.all_members && Array.isArray(response.all_members)) {
          // Wrapped in all_members
          teamData = response.all_members;
        } else if (response?.team_members && Array.isArray(response.team_members)) {
          // Wrapped in team_members
          teamData = response.team_members;
        } else if (response?.members && Array.isArray(response.members)) {
          // Wrapped in members
          teamData = response.members;
        } else if (response?.data && Array.isArray(response.data)) {
          // Wrapped in data
          teamData = response.data;
        }

        setTeamMembers(teamData);
        console.log('[Home] Loaded team members:', teamData.length);

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

  // Load NextivaCX widget - Insert before closing body tag
  useEffect(() => {
    // Add NextivaCX widget script
    const script = document.createElement('script');
    script.id = 'nextivacx-code-snippet';
    script.src = 'https://d3po7etsbw5eiv.cloudfront.net/Simplify360Chat.js?key=NmFjNTAyYTgxODk3OWMxODM2NjllNzY0fDQzNDYyMzg=';
    document.body.appendChild(script);

    // Add CSS styling for the chat widget
    const style = document.createElement('style');
    style.innerHTML = `
      /* NextivaCX Chat Widget Styling */
      .s360-frame,
      .s360-launcher,
      .s360-chat-widget,
      [class*="s360"],
      iframe[src*="simplify360"],
      [class*="chat-widget"],
      [class*="conversation"] {
        opacity: 1 !important;
        visibility: visible !important;
      }

      /* Blinking animation with enhanced motion */
      @keyframes blinkUp {
        0%, 100% {
          transform: translateY(0px) scale(1);
          opacity: 1;
          box-shadow: 0 6px 25px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 107, 53, 0.3);
        }
        50% {
          transform: translateY(-12px) scale(1.05);
          opacity: 1;
          box-shadow: 0 12px 40px rgba(255, 107, 53, 0.7), 0 0 30px rgba(255, 107, 53, 0.5);
        }
      }

      /* Apply animation to chat widget */
      .s360-frame,
      .s360-launcher,
      [class*="s360"],
      iframe[src*="simplify360"] {
        animation: blinkUp 2s ease-in-out infinite !important;
        border-radius: 30px !important;
        padding: 20px !important;
      }

      /* Enhance visibility of text inside widget - VERY BOLD */
      .s360-frame *,
      .s360-launcher *,
      [class*="s360"] * {
        color: #ffffff !important;
        font-weight: 900 !important;
        font-size: 18px !important;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
        letter-spacing: 0.5px !important;
      }

      /* Target conversation message specifically */
      [class*="conversation"],
      [class*="message"],
      [class*="text"] {
        color: #ffffff !important;
        font-weight: 900 !important;
        font-size: 18px !important;
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.4) !important;
      }

      /* Enhanced background with vibrant gradient */
      .s360-frame,
      [class*="s360"] {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ff9f5a 100%) !important;
        border: 3px solid #ff5722 !important;
        border-radius: 30px !important;
        box-shadow: 0 8px 35px rgba(255, 107, 53, 0.6) !important;
      }

      /* Flower decorations using pseudo-elements */
      .s360-launcher::before,
      .s360-launcher::after {
        content: '🌸' !important;
        font-size: 24px !important;
        margin: 0 8px !important;
        display: inline-block !important;
      }

      .s360-frame::before {
        content: '🌺 🌸 🌼 ' !important;
        display: block !important;
        text-align: center !important;
        font-size: 20px !important;
        margin-bottom: 10px !important;
      }

      .s360-frame::after {
        content: ' 🌼 🌸 🌺' !important;
        display: block !important;
        text-align: center !important;
        font-size: 20px !important;
        margin-top: 10px !important;
      }

      /* Hide automatic download transcript popup */
      [class*="transcript"],
      [class*="download"],
      [class*="modal"],
      [class*="popup"],
      [class*="overlay"],
      button:contains('DOWNLOAD') {
        display: none !important;
      }

      /* Style for end-of-conversation confirmation dialog */
      .end-of-chat-modal,
      [class*="end-chat"],
      [class*="conversation-end"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 20px !important;
        padding: 30px !important;
        background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%) !important;
        border-radius: 20px !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
      }

      /* Confirmation message styling */
      [class*="thank"],
      [class*="ended"],
      [class*="end-message"] {
        font-size: 20px !important;
        font-weight: 800 !important;
        color: #1f2937 !important;
        text-align: center !important;
      }

      /* Buttons container */
      [class*="button-group"],
      [class*="actions"] {
        display: flex !important;
        gap: 15px !important;
        width: 100% !important;
        justify-content: center !important;
        flex-wrap: wrap !important;
      }

      /* Download button styling - make it subtle until confirmed */
      [class*="download"],
      button[class*="transcript"],
      a[class*="transcript"],
      a:contains('DOWNLOAD') {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
        color: white !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        font-size: 14px !important;
      }

      [class*="download"]:hover,
      button[class*="transcript"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
      }

      /* Cancel/Close button styling */
      button[class*="cancel"],
      button[class*="close"],
      button[class*="dismiss"],
      .cancel-btn,
      .close-btn {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
        color: white !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        font-size: 14px !important;
      }

      button[class*="cancel"]:hover,
      button[class*="close"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
      }

      /* Add cancel button if not present */
      [class*="download-section"]::after,
      [class*="modal-footer"]::before {
        content: 'CANCEL' !important;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
        color: white !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        font-size: 14px !important;
        display: inline-block !important;
        margin-left: 10px !important;
      }

      /* Confirmation text before download */
      [class*="modal"]::before {
        content: '✓ Conversation Ended Successfully' !important;
        display: block !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        color: #10b981 !important;
        margin-bottom: 20px !important;
        text-align: center !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

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
      {/* ========== HERO SECTION ========== */}
      <div
        style={{
          background: heroImages[currentImageIndex].gradient,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          color: 'white',
          padding: '80px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background 0.8s ease-in-out'
        }}
      >
        {/* Hero Icon Animation */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '120px',
            opacity: 0.15,
            animation: 'float 6s ease-in-out infinite',
            zIndex: 1
          }}
        >
          {heroImages[currentImageIndex].icon}
        </div>

        {/* Carousel Navigation Dots */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '40px',
            display: 'flex',
            gap: '10px',
            zIndex: 10
          }}
        >
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentImageIndex ? '#fbbf24' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-30px); }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            fontWeight: 'bold',
            animation: 'slideIn 0.8s ease-out'
          }}>
            Technology That Helps Your Business Grow
          </h1>
          <p style={{
            fontSize: '18px',
            marginBottom: '20px',
            opacity: 1,
            maxWidth: '800px',
            margin: '0 auto 20px',
            animation: 'slideIn 0.8s ease-out 0.2s both'
          }}>
            We build websites, software and digital solutions that solve real business problems.
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'slideIn 0.8s ease-out 0.4s both'
          }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '40px' }}>
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
      <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '40px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
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
              Contact Us
            </h4>
            <p style={{ marginBottom: '8px' }}>
              📞 <strong>Albert Cabrera: +1 302-208-4855</strong>
            </p>
            <p style={{ marginBottom: '8px' }}>
              📧 <strong>support@ayindetechnologies.com</strong>
            </p>
            <p style={{ marginBottom: '0', fontSize: '12px', opacity: 1 }}>
              📍 <strong>Delaware:</strong><br/>
              1-302-208-4855
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