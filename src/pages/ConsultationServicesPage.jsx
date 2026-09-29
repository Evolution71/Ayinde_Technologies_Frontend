import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ConsultationServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [engagementType, setEngagementType] = useState('hourly');
  const [loading, setLoading] = useState(false);

  const services = {
    optimization: {
      name: 'Platform Optimization',
      description: 'Enhance existing websites and applications with modern technologies',
      icon: '⚡',
      color: '#3b82f6',
      offerings: [
        'Performance Audits & Optimization',
        'Security Assessment & Hardening',
        'Database Optimization',
        'User Experience Improvements',
        'Technology Stack Modernization',
        'Scalability Planning & Implementation',
        'Load Testing & Performance Analysis',
        'Migration Planning & Execution'
      ],
      hourlyRate: '$200/hr',
      retainerRate: '$5,000/month',
      projectRate: 'Custom Quote'
    },
    maintenance: {
      name: 'Maintenance & Support',
      description: 'Comprehensive ongoing support with updates, bug fixes, and diagnostics',
      icon: '🔧',
      color: '#8b5cf6',
      offerings: [
        'Continuous Security Patching',
        'Dependency & Library Updates',
        'Bug Identification & Resolution',
        'System Health Monitoring',
        'Backup & Disaster Recovery',
        'Quarterly Health Reports',
        'Proactive Issue Prevention',
        'Emergency Response (24/7)'
      ],
      hourlyRate: '$150/hr',
      retainerRate: '$3,000/month',
      projectRate: 'Custom Quote'
    },
    strategy: {
      name: 'Technology Strategy',
      description: 'Long-term roadmap development and digital transformation guidance',
      icon: '🗺️',
      color: '#f59e0b',
      offerings: [
        'AI/ML Implementation Strategy',
        'Technology Stack Evaluation',
        'Cloud Architecture Planning',
        'Integration & API Strategy',
        'Automation Opportunities Assessment',
        'Cost Optimization Analysis',
        'Digital Transformation Roadmap',
        'Team Training & Knowledge Transfer'
      ],
      hourlyRate: '$250/hr',
      retainerRate: '$7,000/month',
      projectRate: 'Custom Quote'
    },
    analytics: {
      name: 'Growth Analytics',
      description: 'Data-driven insights for user acquisition, engagement, and revenue optimization',
      icon: '📊',
      color: '#10b981',
      offerings: [
        'User Behavior Analysis',
        'Conversion Rate Optimization',
        'Funnel Analysis & Improvement',
        'Monetization Strategy Development',
        'Competitive Analysis & Positioning',
        'Growth Roadmap Development',
        'A/B Testing Framework Setup',
        'Custom Dashboard Development'
      ],
      hourlyRate: '$200/hr',
      retainerRate: '$4,500/month',
      projectRate: 'Custom Quote'
    },
    features: {
      name: 'Feature Development',
      description: 'Strategic feature prioritization, design consultation, and development guidance',
      icon: '🎯',
      color: '#ef4444',
      offerings: [
        'Feature Requirement Analysis',
        'User Research & Testing',
        'UI/UX Design Consultation',
        'Technical Feasibility Assessment',
        'Development Oversight & Code Review',
        'Quality Assurance Guidance',
        'Feature Prioritization Framework',
        'Launch & Rollout Strategy'
      ],
      hourlyRate: '$220/hr',
      retainerRate: '$5,500/month',
      projectRate: 'Custom Quote'
    },
    compliance: {
      name: 'Compliance & Security',
      description: 'Ensure your digital assets meet industry standards, regulations, and security best practices',
      icon: '🔒',
      color: '#06b6d4',
      offerings: [
        'Security Vulnerability Assessment',
        'Regulatory Compliance Review',
        'Data Privacy & GDPR Compliance',
        'Incident Response Planning',
        'Security Training & Documentation',
        'Third-Party Vendor Vetting',
        'Penetration Testing Coordination',
        'Compliance Audit Preparation'
      ],
      hourlyRate: '$250/hr',
      retainerRate: '$6,000/month',
      projectRate: 'Custom Quote'
    }
  };

  const handleConsultation = async (serviceKey) => {
    if (!user) {
      alert('Please login to book a consultation');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const service = services[serviceKey];

      const consultationData = {
        serviceKey: serviceKey,
        serviceName: service.name,
        engagementType: engagementType,
        rate: engagementType === 'hourly' ? service.hourlyRate :
              engagementType === 'retainer' ? service.retainerRate :
              service.projectRate,
        bookingTime: new Date().toISOString()
      };

      localStorage.setItem('pendingConsultation', JSON.stringify(consultationData));

      // Redirect to consultation booking page (you'll need to create this)
      navigate('/consultation-booking', { state: { consultationData } });
    } catch (err) {
      console.error('Error booking consultation:', err);
      alert('Error booking consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ServiceCard = ({ serviceKey, service }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: selectedService === serviceKey ? '3px solid ' + service.color : '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
      position: 'relative'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '40px', marginBottom: '15px' }}>
        {service.icon}
      </div>

      <h3 style={{ color: service.color, marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
        {service.name}
      </h3>

      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        {service.description}
      </p>

      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h4 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
          What We Provide:
        </h4>
        {service.offerings.map((offering, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: service.color, marginRight: '8px' }}>✓</span>
            <span style={{ fontSize: '13px', color: '#666' }}>{offering}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
          Engagement Options:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <span style={{ fontSize: '13px' }}>💰 Hourly:</span>
            <span style={{ fontWeight: 'bold', color: service.color, fontSize: '13px' }}>{service.hourlyRate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <span style={{ fontSize: '13px' }}>📅 Monthly Retainer:</span>
            <span style={{ fontWeight: 'bold', color: service.color, fontSize: '13px' }}>{service.retainerRate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <span style={{ fontSize: '13px' }}>🎯 Project-Based:</span>
            <span style={{ fontWeight: 'bold', color: service.color, fontSize: '13px' }}>{service.projectRate}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedService(serviceKey);
          handleConsultation(serviceKey);
        }}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: service.color,
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Processing...' : 'Book Consultation →'}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px', color: '#1e40af' }}>
          🎓 Strategic Consultation Services
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
          Expert guidance for existing platforms, optimization, and technology transformation. Flexible engagement models tailored to your needs.
        </p>
      </div>

      {/* Services Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {Object.entries(services).map(([serviceKey, service]) => (
          <ServiceCard key={serviceKey} serviceKey={serviceKey} service={service} />
        ))}
      </div>

      {/* Engagement Models Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '60px auto',
        backgroundColor: '#f0f9ff',
        borderRadius: '12px',
        padding: '40px',
        marginBottom: '60px'
      }}>
        <h2 style={{ color: '#1e40af', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
          Flexible Engagement Models
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              ⏰ Hourly Consultation
            </h3>
            <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
              Perfect for specific questions, code reviews, or short-term guidance. Billed in 1-hour increments.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ $150-$250/hour</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ Minimum 1 hour</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ Flexible scheduling</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px' }}>✓ Expert guidance</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #f59e0b' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginBottom: '15px' }}>
              RECOMMENDED
            </div>
            <h3 style={{ color: '#f59e0b', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              📅 Monthly Retainer
            </h3>
            <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
              Best for ongoing support and optimization. Dedicated time allocation and priority support included.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ $3,000-$7,000/month</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ 20-40 hours/month</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ 24/7 emergency support</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px' }}>✓ Priority issue resolution</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              🎯 Project-Based
            </h3>
            <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
              Custom pricing for specific projects, migrations, or development oversight engagements.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ Custom pricing</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ Fixed scope & timeline</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px', borderBottom: '1px solid #eee' }}>✓ Detailed deliverables</li>
              <li style={{ padding: '8px 0', color: '#666', fontSize: '13px' }}>✓ Payment milestones</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{
        maxWidth: '1200px',
        margin: '60px auto 80px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ color: '#1e40af', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
          Why Choose Ayinde Consultation?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎓</div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Expert Team</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Experienced engineers with proven track record across 20+ enterprise projects and startups.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Fast Results</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Quick diagnosis and actionable recommendations. No lengthy discovery phase—we get straight to solutions.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌍</div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>24/7 Available</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Support offices in Los Angeles and Lagos. Emergency consultation available around the clock.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Data-Driven</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Every recommendation backed by analytics, benchmarking, and industry best practices.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤝</div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Partnership</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              We're invested in your success. Long-term relationships, not one-off transactions.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Proven Results</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              30-40% average performance improvements. Real metrics, real impact on your bottom line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationServicesPage;