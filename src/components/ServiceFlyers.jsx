import React, { useState } from 'react';

const ServiceFlyers = () => {
  const [selectedFlyer, setSelectedFlyer] = useState(0);

  const flyers = [
    {
      id: 1,
      title: 'Website Development',
      icon: '🌐',
      color: '#3b82f6',
      features: [
        'Custom responsive websites',
        'SEO-optimized pages',
        'Fast loading & performance',
        'Mobile-first design',
        'CMS integration',
        'Analytics & tracking'
      ],
      description: 'Professional websites built to convert visitors into customers.',
      timeline: '2-6 weeks',
      price: 'Custom quote'
    },
    {
      id: 2,
      title: 'Application Development',
      icon: '📱',
      color: '#8b5cf6',
      features: [
        'Web applications',
        'Mobile apps (iOS/Android)',
        'Real-time data processing',
        'Cloud integration',
        'API development',
        'Scalable architecture'
      ],
      description: 'Robust applications that scale with your business.',
      timeline: '4-12 weeks',
      price: 'Custom quote'
    },
    {
      id: 3,
      title: 'Tech Consultation',
      icon: '💬',
      color: '#ec4899',
      features: [
        'Technology strategy',
        'Architecture planning',
        'Security assessment',
        'Performance optimization',
        'Team training',
        'Implementation roadmap'
      ],
      description: 'Expert guidance to make smart technology decisions.',
      timeline: '1-2 weeks',
      price: 'Hourly / Project-based'
    },
    {
      id: 4,
      title: 'Premium Services',
      icon: '👑',
      color: '#f59e0b',
      features: [
        'AI/ML integration',
        '24/7 support included',
        'Dedicated account manager',
        'Custom development',
        'Enterprise solutions',
        'SLA guarantee'
      ],
      description: 'Premium support and advanced solutions for enterprise needs.',
      timeline: 'Flexible',
      price: 'Enterprise pricing'
    }
  ];

  const flyer = flyers[selectedFlyer];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Our Service Offerings
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Choose a service to view detailed information
          </p>
        </div>

        {/* Flyer Selector Tabs */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          {flyers.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setSelectedFlyer(idx)}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: selectedFlyer === idx ? f.color : '#e5e7eb',
                color: selectedFlyer === idx ? 'white' : '#1f2937',
                transition: 'all 0.3s ease',
                transform: selectedFlyer === idx ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {f.icon} {f.title}
            </button>
          ))}
        </div>

        {/* Flyer Display */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 auto',
            pageBreakInside: 'avoid'
          }}
        >
          {/* Flyer Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${flyer.color} 0%, ${flyer.color}dd 100%)`,
              color: 'white',
              padding: '60px 40px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>{flyer.icon}</div>
            <h2 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
              {flyer.title}
            </h2>
            <p style={{ fontSize: '18px', margin: 0, opacity: 0.95 }}>
              {flyer.description}
            </p>
          </div>

          {/* Flyer Content */}
          <div style={{ padding: '50px 40px' }}>
            {/* Key Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
              <div>
                <h3 style={{ color: '#1e40af', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                  Timeline
                </h3>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {flyer.timeline}
                </p>
              </div>
              <div>
                <h3 style={{ color: '#1e40af', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                  Investment
                </h3>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {flyer.price}
                </p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 style={{ color: '#1e40af', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>
                What's Included
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {flyer.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: '12px 0',
                      borderBottom: idx < flyer.features.length - 1 ? '1px solid #e5e7eb' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '16px',
                      color: '#4b5563'
                    }}
                  >
                    <span style={{ color: flyer.color, fontSize: '20px', fontWeight: 'bold' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Ready to get started?
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="/contact-form"
                  style={{
                    display: 'inline-block',
                    padding: '14px 32px',
                    backgroundColor: flyer.color,
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Get Started
                </a>
                <button
                  onClick={handlePrint}
                  style={{
                    padding: '14px 32px',
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  📄 Print / Save
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: '#f3f4f6', padding: '20px 40px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
            <p style={{ margin: 0 }}>
              📞 +1 302-208-4855 | 📧 support@ayindetechnologies.com<br/>
              East Coast: Delaware, USA | Westcoast: California, USA
            </p>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            body {
              background: white;
              padding: 0;
            }
            div {
              page-break-inside: avoid;
            }
            button {
              display: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ServiceFlyers;