import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationServicesPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('starter');
  const [paymentOption, setPaymentOption] = useState('monthly');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    appType: '',
    timeline: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const tiers = {
    starter: {
      name: 'App Development Starter',
      basePrice: 897,
      period: '/month',
      description: 'Launch Your First App',
      color: '#06b6d4',
      icon: '📱',
      features: [
        'Native iOS App Development',
        'Native Android App Development',
        'Firebase Backend Setup',
        'Basic Push Notifications',
        'User Authentication',
        'Basic Database Design',
        'App Store Submission Support',
        'Monthly Updates (16 hours)',
        'Email Support',
        'Performance Monitoring'
      ]
    },
    professional: {
      name: 'App Development Professional',
      basePrice: 1097,
      period: '/month',
      description: 'For Growing Apps',
      color: '#8b5cf6',
      icon: '⭐',
      features: [
        'All Starter Features',
        'Advanced Database Architecture',
        'Real-time Data Synchronization',
        'In-app Payments Integration',
        'Push Notifications (Advanced)',
        'Social Media Integration',
        'Analytics Dashboard',
        'API Development',
        'Weekly Updates (24 hours)',
        '24/7 Priority Support',
        'Version Control & Deployment'
      ]
    },
    advanced: {
      name: 'App Development Advanced',
      basePrice: 1297,
      period: '/month',
      description: 'Enterprise-Level Features',
      color: '#f59e0b',
      icon: '💎',
      features: [
        'All Professional Features',
        'Cross-Platform Development (iOS & Android)',
        'Advanced Security Features',
        'AI/ML Integration',
        'Real-time Chat Integration',
        'Video Streaming Integration',
        'Advanced Payment Processing',
        'Custom API Development',
        'Bi-weekly Updates (32 hours)',
        'Dedicated Development Team',
        '24/7 Dedicated Support',
        'Performance Optimization'
      ]
    },
    premium: {
      name: 'App Development Premium',
      basePrice: 1497,
      period: '/month',
      description: 'Complete Enterprise Solution',
      color: '#10b981',
      icon: '👑',
      features: [
        'All Advanced Features',
        'Dedicated Account Manager',
        'Custom App Architecture',
        'Cloud Infrastructure Setup',
        'Advanced AI/ML Features',
        'Enterprise Security',
        'Multi-platform Support (Web + Mobile)',
        'Custom Integrations',
        'Weekly Updates (40+ hours)',
        'Dedicated Development Team',
        '24/7 Priority Support',
        'Quarterly Strategy Reviews',
        'White Label Options',
        'Priority Feature Development'
      ]
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('App Development Inquiry:', formData);
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        appType: '',
        timeline: ''
      });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (tier) => {
    if (!tier) return 0;

    let basePrice = 0;

    if (paymentOption === 'monthly') {
      basePrice = tier.basePrice;
    } else if (paymentOption === 'quarterly') {
      basePrice = tier.basePrice * 3 * 0.95;
    } else if (paymentOption === 'annual') {
      basePrice = tier.basePrice * 12 * 0.9;
    } else if (paymentOption === 'halfdown') {
      basePrice = (tier.basePrice * 6) / 2;
    }

    const discount = (basePrice * discountPercent) / 100;
    const finalPrice = basePrice - discount;

    return { price: finalPrice, discount, period: paymentOption, basePrice };
  };

  const handleCheckout = async (tierKey) => {
    if (!selectedTier) {
      alert('Please select a tier first');
      return;
    }

    setLoading(true);

    try {
      const tier = tiers[tierKey];
      const priceInfo = calculatePrice(tier);

      const paymentData = {
        service: 'application',
        tier: tierKey,
        tierName: tier.name,
        amount: Math.round(priceInfo.price * 100),
        currency: 'USD',
        paymentOption: paymentOption,
        discountPercent: discountPercent,
        discountAmount: Math.round(priceInfo.discount * 100),
        originalPrice: Math.round(priceInfo.basePrice * 100),
        finalPrice: Math.round(priceInfo.price * 100),
        features: tier.features
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

  const PricingCard = ({ tierKey, tier }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      border: selectedTier === tierKey ? `3px solid ${tier.color}` : '2px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: selectedTier === tierKey ? `0 10px 30px ${tier.color}40` : '0 2px 8px rgba(0,0,0,0.1)',
      transform: selectedTier === tierKey ? 'translateY(-5px)' : 'translateY(0)'
    }}
    onClick={() => setSelectedTier(tierKey)}>
      <div style={{ marginBottom: '10px', fontSize: '40px' }}>
        {tier.icon}
      </div>
      <h3 style={{ color: tier.color, marginBottom: '8px' }}>{tier.name}</h3>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>{tier.description}</p>

      <div style={{
        backgroundColor: tier.color + '10',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: tier.color }}>
          ${tier.basePrice}
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>per month</div>
      </div>

      <button
        onClick={() => setShowBreakdown(tierKey)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: tier.color,
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

      {selectedTier === tierKey && (
        <button
          onClick={() => handleCheckout(tierKey)}
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
          {loading ? 'Processing...' : 'Select This Plan'}
        </button>
      )}
    </div>
  );

  const FeatureBreakdown = ({ tierKey }) => {
    if (!showBreakdown) return null;

    const tier = tiers[tierKey];
    const priceInfo = calculatePrice(tier);

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
            <h2 style={{ color: tier.color, margin: 0 }}>{tier.name}</h2>
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
            {tier.features.map((feature, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ color: tier.color, marginRight: '12px', fontWeight: 'bold' }}>✓</span>
                <span style={{ color: '#333' }}>{feature}</span>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>Pricing Options:</h3>

            <div style={{ marginBottom: '15px' }}>
              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              >
                <option value="monthly">Monthly - ${tier.basePrice}/month</option>
                <option value="quarterly">Quarterly - ${(tier.basePrice * 3 * 0.95).toFixed(0)} (5% savings)</option>
                <option value="annual">Annual - ${(tier.basePrice * 12 * 0.9).toFixed(0)} (10% savings)</option>
                <option value="halfdown">50% Down + 6 Months</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Special Offer (30 days):
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[0, 5, 10, 20].map((discount) => (
                  <button
                    key={discount}
                    onClick={() => setDiscountPercent(discount)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: discountPercent === discount ? `2px solid ${tier.color}` : '1px solid #ddd',
                      backgroundColor: discountPercent === discount ? tier.color + '20' : 'white',
                      color: discountPercent === discount ? tier.color : '#333',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '12px'
                    }}
                  >
                    {discount === 0 ? 'No Discount' : `${discount}% OFF`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '6px',
              marginTop: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Original Price:</span>
                <span style={{ fontWeight: 'bold' }}>${priceInfo.basePrice.toFixed(2)}</span>
              </div>
              {priceInfo.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a' }}>
                  <span>Discount ({discountPercent}%):</span>
                  <span>-${priceInfo.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '2px solid #ddd',
                fontSize: '18px',
                fontWeight: 'bold',
                color: tier.color
              }}>
                <span>Final Price:</span>
                <span>${priceInfo.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              handleCheckout(tierKey);
              setShowBreakdown(null);
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: tier.color,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
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
            📱 Application Development Services
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Professional mobile and web app development for your business
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            ✅ iOS & Android | ✅ Web Apps | ✅ 24/7 Support
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {Object.entries(tiers).map(([key, tier]) => (
            <PricingCard key={key} tierKey={key} tier={tier} />
          ))}
        </div>

        {/* Info Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            Our Development Expertise
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ color: '#06b6d4', marginBottom: '8px' }}>🚀 Fast Development</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Quick turnaround times without compromising quality</p>
            </div>
            <div>
              <h3 style={{ color: '#06b6d4', marginBottom: '8px' }}>🔧 Latest Technology</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Built with modern frameworks and best practices</p>
            </div>
            <div>
              <h3 style={{ color: '#06b6d4', marginBottom: '8px' }}>🌐 Cross-Platform</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Native iOS, Android, and web applications</p>
            </div>
            <div>
              <h3 style={{ color: '#06b6d4', marginBottom: '8px' }}>🔒 Secure</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Enterprise-grade security and data protection</p>
            </div>
            <div>
              <h3 style={{ color: '#06b6d4', marginBottom: '8px' }}>💰 Monetization</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>In-app purchases and payment integration</p>
            </div>
            <div>
              <h3 style={{ color: '#06b6d4', marginBottom: '8px' }}>📊 Analytics</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Real-time insights and performance tracking</p>
            </div>
          </div>
        </div>

        {/* App Development Inquiry Form */}
        <div style={{
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          padding: '40px',
          marginTop: '40px'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            Let's Build Your App
          </h2>
          <form onSubmit={handleFormSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  placeholder="Your company"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+1 (555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                What type of app? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="appType"
                value={formData.appType}
                onChange={handleFormChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select an option</option>
                <option value="ios">iOS App</option>
                <option value="android">Android App</option>
                <option value="crossplatform">Cross-Platform</option>
                <option value="webapp">Web App</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                Timeline <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleFormChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select timeline</option>
                <option value="urgent">Within 2 weeks</option>
                <option value="month">Within a month</option>
                <option value="flexible">Flexible timeline</option>
              </select>
            </div>

            {formSubmitted && (
              <div style={{
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: '#d1fae5',
                color: '#047857',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                ✓ Thank you! We'll be in touch soon.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                backgroundColor: loading ? '#9ca3af' : '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Submitting...' : 'Schedule a Demo'}
            </button>
          </form>
        </div>
      </div>

      {showBreakdown && <FeatureBreakdown tierKey={showBreakdown} />}
    </div>
  );
};

export default ApplicationServicesPage;