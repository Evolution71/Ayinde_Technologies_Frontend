import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicesOverviewPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Website Services',
      description: 'Professional website solutions tailored to your business needs',
      icon: '🌐',
      color: '#3b82f6',
      features: ['Custom Design', 'SEO Optimization', 'Mobile Responsive', 'E-Commerce Ready'],
      price: 'From $297/month',
      cta: 'View Website Services',
      path: '/services/website'
    },
    {
      id: 2,
      title: 'Application Development',
      description: 'Native iOS & Android apps plus web applications',
      icon: '📱',
      color: '#06b6d4',
      features: ['iOS Development', 'Android Development', 'Web Apps', 'API Integration'],
      price: 'From $897/month',
      cta: 'View App Services',
      path: '/services/applications'
    },
    {
      id: 3,
      title: 'Consultation Services',
      description: 'Expert consulting for strategic business decisions',
      icon: '💡',
      color: '#f59e0b',
      features: ['Business Audit', 'Tech Strategy', 'Digital Transformation', 'Growth Planning'],
      price: 'From $100/hour',
      cta: 'Book Consultation',
      path: '/services/consultation'
    },
    {
      id: 4,
      title: 'Premium Enterprise Solutions',
      description: 'Complete all-in-one enterprise solutions',
      icon: '👑',
      color: '#10b981',
      features: ['Website + App', 'Enterprise Support', 'Advanced AI', 'Custom Integrations'],
      price: '$2,394/month',
      cta: 'View Premium Package',
      path: '/services/premium'
    }
  ];

  const highlights = [
    {
      title: '24/7 Support',
      description: 'Round-the-clock support for all your needs',
      icon: '🕐'
    },
    {
      title: 'Regular Updates',
      description: 'Continuous improvements and feature updates',
      icon: '🔄'
    },
    {
      title: 'Security Included',
      description: 'Enterprise-grade security & data protection',
      icon: '🔒'
    },
    {
      title: 'Flexible Plans',
      description: 'Scale up or down based on your needs',
      icon: '📊'
    },
    {
      title: 'Expert Team',
      description: 'Experienced professionals dedicated to your success',
      icon: '👥'
    },
    {
      title: 'Proven Track Record',
      description: '500+ projects delivered successfully',
      icon: '✅'
    }
  ];

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingTop: '40px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
            💼 Our Services
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Comprehensive technology solutions for every business need
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            From websites to enterprise applications - we've got you covered
          </p>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {services.map((service) => (
            <div key={service.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: `2px solid ${service.color}20`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = `0 15px 30px ${service.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{service.icon}</div>

              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px', color: service.color }}>
                {service.title}
              </h2>

              <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
                {service.description}
              </p>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                  Key Features:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
                  {service.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div style={{
                backgroundColor: service.color + '10',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: service.color }}>
                  {service.price}
                </div>
              </div>

              <button
                onClick={() => navigate(service.path)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: service.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {service.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            Why Choose Ayinde Technologies?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {highlights.map((highlight, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{highlight.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                  {highlight.title}
                </h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers Overview */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            Pricing Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              borderLeft: '4px solid #3b82f6'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6', fontWeight: 'bold' }}>Website Services</h4>
              <p style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }}>$297 - $897</p>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>per month</p>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#ecf0ff',
              borderRadius: '8px',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#8b5cf6', fontWeight: 'bold' }}>Application Services</h4>
              <p style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }}>$897 - $1,497</p>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>per month</p>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#f59e0b', fontWeight: 'bold' }}>Consultation Services</h4>
              <p style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }}>$100 - $300</p>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>per hour</p>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              borderLeft: '4px solid #10b981'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#10b981', fontWeight: 'bold' }}>Premium Enterprise</h4>
              <p style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }}>$2,394</p>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>per month or $50k flat</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
            Ready to Transform Your Business?
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '25px', opacity: 0.9 }}>
            Get started today with a free consultation or explore our service packages
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/services/consultation')}
              style={{
                padding: '14px 32px',
                backgroundColor: 'white',
                color: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Free Consultation
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverviewPage;