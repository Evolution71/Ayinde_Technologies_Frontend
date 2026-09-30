import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultationServicesPage = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [hoursNeeded, setHoursNeeded] = useState(3);
  const [showBreakdown, setShowBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultationPackages = {
    standard: {
      name: 'Standard Consultation',
      hourlyRate: 100,
      minHours: 3,
      description: 'Ideal for small projects & quick advice',
      color: '#3b82f6',
      icon: '💡',
      includes: [
        'One-on-one consultation',
        'Strategy & advice',
        'Up to 3 hours per session',
        'Email support',
        'Solutions & recommendations',
        'Project roadmap (basic)'
      ]
    },
    enterprise: {
      name: 'Enterprise Consultation',
      hourlyRate: 300,
      minHours: 10,
      description: 'For comprehensive projects & in-depth analysis',
      color: '#f59e0b',
      icon: '👔',
      includes: [
        'Dedicated consultant',
        'Deep-dive strategy sessions',
        'Minimum 10 hours',
        'Priority email & phone support',
        'Detailed recommendations report',
        'Implementation roadmap',
        'Weekly check-ins',
        'Custom solutions design'
      ]
    }
  };

  const diagnosticServices = [
    {
      title: 'Business Audit',
      description: 'Complete analysis of your current operations, technology stack, and market position',
      items: ['Current state assessment', 'Competitive analysis', 'Strengths & weaknesses', 'Opportunities identification']
    },
    {
      title: 'Technology Strategy',
      description: 'Custom tech roadmap aligned with your business goals',
      items: ['Architecture planning', 'Technology selection', 'Implementation timeline', 'Resource allocation']
    },
    {
      title: 'Digital Transformation',
      description: 'Guidance on modernizing your digital infrastructure',
      items: ['Process optimization', 'Cloud migration', 'Automation opportunities', 'Integration planning']
    },
    {
      title: 'Growth Strategy',
      description: 'Develop strategies to scale your business efficiently',
      items: ['Market expansion', 'Product development', 'Revenue optimization', 'Customer acquisition']
    }
  ];

  const calculateTotal = () => {
    const pkg = consultationPackages[selectedPackage];
    const hours = Math.max(hoursNeeded, pkg.minHours);
    return hours * pkg.hourlyRate;
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const pkg = consultationPackages[selectedPackage];
      const hours = Math.max(hoursNeeded, pkg.minHours);
      const totalAmount = calculateTotal();

      const paymentData = {
        service: 'consultation',
        type: selectedPackage,
        packageName: pkg.name,
        hourlyRate: pkg.hourlyRate,
        hours: hours,
        amount: Math.round(totalAmount * 100),
        currency: 'USD',
        includes: pkg.includes
      };

      localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
      navigate('/services/checkout', { state: { paymentData } });
    } catch (err) {
      console.error('Error preparing checkout:', err);
      alert('Error preparing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ConsultationCard = ({ packageKey, pkg }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      border: selectedPackage === packageKey ? `3px solid ${pkg.color}` : '2px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: selectedPackage === packageKey ? `0 10px 30px ${pkg.color}40` : '0 2px 8px rgba(0,0,0,0.1)',
      transform: selectedPackage === packageKey ? 'translateY(-5px)' : 'translateY(0)'
    }}
    onClick={() => setSelectedPackage(packageKey)}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{pkg.icon}</div>
      <h3 style={{ color: pkg.color, marginBottom: '8px' }}>{pkg.name}</h3>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>{pkg.description}</p>

      <div style={{
        backgroundColor: pkg.color + '10',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: pkg.color }}>
          ${pkg.hourlyRate}
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>per hour</div>
        <div style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
          Minimum: {pkg.minHours} hours
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>What's Included:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '13px', lineHeight: '1.8' }}>
          {pkg.includes.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {selectedPackage === packageKey && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
            Hours Needed (Minimum {pkg.minHours} hours):
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={() => setHoursNeeded(Math.max(hoursNeeded - 1, pkg.minHours))}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `2px solid ${pkg.color}`,
                backgroundColor: 'white',
                color: pkg.color,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              −
            </button>
            <input
              type="number"
              min={pkg.minHours}
              value={hoursNeeded}
              onChange={(e) => setHoursNeeded(Math.max(parseInt(e.target.value) || pkg.minHours, pkg.minHours))}
              style={{
                width: '50px',
                textAlign: 'center',
                padding: '8px',
                border: `1px solid ${pkg.color}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={() => setHoursNeeded(hoursNeeded + 1)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `2px solid ${pkg.color}`,
                backgroundColor: 'white',
                color: pkg.color,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowBreakdown(packageKey)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: selectedPackage === packageKey ? '15px' : '0',
          backgroundColor: pkg.color,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
      >
        View Details
      </button>

      {selectedPackage === packageKey && (
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Processing...' : `Book Now - $${calculateTotal()}`}
        </button>
      )}
    </div>
  );

  const FeatureBreakdown = ({ packageKey }) => {
    if (!showBreakdown) return null;

    const pkg = consultationPackages[packageKey];
    const totalAmount = calculateTotal();

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: pkg.color, margin: 0 }}>{pkg.name}</h2>
            <button
              onClick={() => setShowBreakdown(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ✕
            </button>
          </div>

          <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>What's Included:</h3>
          <div style={{ marginBottom: '30px' }}>
            {pkg.includes.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ color: pkg.color, marginRight: '12px', fontWeight: 'bold' }}>✓</span>
                <span style={{ color: '#333' }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>Pricing Breakdown:</h3>

            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '6px',
              marginTop: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Hourly Rate:</span>
                <span style={{ fontWeight: 'bold' }}>${pkg.hourlyRate}/hour</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Hours Booked:</span>
                <span style={{ fontWeight: 'bold' }}>{hoursNeeded} hours</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '2px solid #ddd',
                fontSize: '18px',
                fontWeight: 'bold',
                color: pkg.color
              }}>
                <span>Total Cost:</span>
                <span>${totalAmount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              handleCheckout();
              setShowBreakdown(null);
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: pkg.color,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              opacity: loading ? 0.6 : 1,
              marginBottom: '10px'
            }}
          >
            {loading ? 'Processing...' : `Book Consultation - $${totalAmount}`}
          </button>
          <button
            onClick={() => setShowBreakdown(null)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#e5e7eb',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingTop: '40px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
            🎯 Consultation Services
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Expert guidance tailored to your unique business needs
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            ✅ Flexible Hours | ✅ Personalized Strategy | ✅ Actionable Recommendations
          </p>
        </div>

        {/* Consultation Packages */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {Object.entries(consultationPackages).map(([key, pkg]) => (
            <ConsultationCard key={key} packageKey={key} pkg={pkg} />
          ))}
        </div>

        {/* Diagnostic Services */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            Our Consultation Services
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {diagnosticServices.map((service, i) => (
              <div key={i} style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '2px solid #e5e7eb'
              }}>
                <h3 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>
                  {service.description}
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#555', lineHeight: '1.8' }}>
                  {service.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            Why Choose Our Consultants?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>✓ Expert Experience</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>15+ years of combined industry expertise and proven track record</p>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>✓ Customized Approach</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Tailored strategies that fit your specific business goals and budget</p>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>✓ Actionable Results</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Clear recommendations you can implement immediately</p>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>✓ Flexible Engagement</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Book as few or as many hours as you need for your project</p>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>✓ Ongoing Support</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Multiple follow-up sessions to ensure successful implementation</p>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>✓ Proven ROI</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Strategies backed by data and results from hundreds of clients</p>
            </div>
          </div>
        </div>
      </div>

      {showBreakdown && <FeatureBreakdown packageKey={showBreakdown} />}
    </div>
  );
};

export default ConsultationServicesPage;