import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ApplicationServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentOption, setPaymentOption] = useState('monthly');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  // Application Pricing Tiers
  const tiers = {
    bronze: {
      name: 'Bronze',
      basePrice: 897,
      period: '/month',
      description: 'Platform Launch',
      color: '#92400e',
      badge: null,
      features: [
        'Custom Application Development',
        'Basic AI-Powered Features',
        'iOS & Android Compatibility',
        'App Store & Google Play Publishing',
        'Basic User Analytics',
        'Monthly Maintenance & Bug Fixes',
        'Technical Support (Business Hours)',
        'Basic Performance Monitoring',
        'Standard Security Features'
      ]
    },
    silver: {
      name: 'Silver',
      basePrice: 1097,
      period: '/month',
      description: 'Enhanced Performance',
      color: '#64748b',
      badge: null,
      features: [
        'Custom Application Development',
        'Advanced AI-Powered Capabilities',
        'iOS & Android Full Deployment',
        'Cross-Platform Optimization',
        'Advanced Analytics & User Insights',
        'Bi-weekly Updates & Enhancement',
        'Performance Monitoring & Alerts',
        'Priority Support (Extended Hours)',
        'User Behavior Analytics',
        'Push Notification System',
        'In-App Messaging'
      ]
    },
    gold: {
      name: 'Gold',
      basePrice: 1297,
      period: '/month',
      description: 'Complete Platform',
      color: '#d97706',
      badge: 'BEST VALUE',
      features: [
        'Custom Application Development',
        'Advanced AI & Chatbot Integration',
        'iOS & Android Deployment',
        'Built-in Monetization Systems',
        'Payment Gateway Integration (Stripe, Square)',
        'Advanced Analytics & Dashboard',
        'Weekly Updates & Optimization',
        'In-App Support Systems',
        '24/7 Support & Rapid Bug Repairs',
        'User Segmentation & Targeting',
        'A/B Testing Framework',
        'Social Media Integration',
        'Offline Mode Support'
      ]
    },
    platinum: {
      name: 'Platinum',
      basePrice: 1497,
      period: '/month',
      description: 'Enterprise Excellence',
      color: '#7c3aed',
      badge: 'PREMIUM',
      features: [
        'Custom Application Development',
        'Latest Advanced AI Functions',
        'Advanced AI Chatbot & Automation',
        'iOS & Android Deployment',
        'Built-in Monetization & Revenue Sharing',
        'Multiple Payment Gateway Integration',
        'Enterprise-Grade Analytics Dashboard',
        'Real-Time User Behavior Tracking',
        'Regular Feature Updates',
        'Rapid Bug Repairs & Maintenance',
        'Proactive Performance Optimization',
        '24/7 Dedicated Support Team',
        'White-Label Options Available',
        'Custom API Development',
        'Advanced Security & Compliance',
        'Regular Strategy Reviews & Recommendations'
      ]
    }
  };

  // Calculate price based on tier and options
  const calculatePrice = (tier) => {
    if (!tier) return 0;

    let basePrice = tier.basePrice;
    let period = 'monthly';

    if (paymentOption === 'quarterly') {
      basePrice = tier.basePrice * 3 * 0.95; // 5% discount for quarterly
      period = 'quarterly';
    } else if (paymentOption === 'annual') {
      basePrice = tier.basePrice * 12 * 0.9; // 10% discount for annual
      period = 'annual';
    } else if (paymentOption === 'halfdown') {
      basePrice = (tier.basePrice * 6) / 2; // 50% down for 6 months
      period = '50% down + 6 months';
    }

    const discount = (basePrice * discountPercent) / 100;
    const finalPrice = basePrice - discount;

    return { price: finalPrice, discount, period, basePrice };
  };

  // Handle checkout
  const handleCheckout = async (tierKey) => {
    if (!user) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const tier = tiers[tierKey];
      const priceInfo = calculatePrice(tier);

      const paymentData = {
        tier: tierKey,
        tierName: tier.name,
        amount: Math.round(priceInfo.price * 100),
        currency: 'USD',
        paymentOption: paymentOption,
        discountPercent: discountPercent,
        discountAmount: Math.round(priceInfo.discount * 100),
        originalPrice: Math.round(priceInfo.basePrice * 100),
        finalPrice: Math.round(priceInfo.price * 100),
        period: priceInfo.period,
        serviceType: 'application',
        features: tier.features
      };

      localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
      navigate('/checkout', { state: { paymentData } });
    } catch (err) {
      console.error('Error preparing checkout:', err);
      alert('Error preparing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Feature Breakdown Modal
  const FeatureBreakdown = ({ tierKey }) => {
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
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: tier.color, marginBottom: '10px' }}>
              {tier.name} - Application Services
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {tier.description}
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
              What's Included:
            </h3>
            <div>
              {tier.features.map((feature, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: tier.color, marginRight: '12px', fontWeight: 'bold' }}>✓</span>
                  <span style={{ color: '#333', lineHeight: '1.5' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
              Pricing Options:
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Payment Term:
              </label>
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
                <option value="quarterly">Quarterly - ${(tier.basePrice * 3 * 0.95).toFixed(2)} (5% off)</option>
                <option value="annual">Annual - ${(tier.basePrice * 12 * 0.9).toFixed(2)} (10% off)</option>
                <option value="halfdown">50% Down + 6 Months</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Limited Time Offer (30 days):
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[0, 5, 10, 20].map((discount) => (
                  <button
                    key={discount}
                    onClick={() => setDiscountPercent(discount)}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '6px',
                      border: discountPercent === discount ? '2px solid ' + tier.color : '1px solid #ddd',
                      backgroundColor: discountPercent === discount ? tier.color + '20' : 'white',
                      color: discountPercent === discount ? tier.color : '#333',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '14px'
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
                <span>${priceInfo.basePrice.toFixed(2)}</span>
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
                borderTop: '2px solid #eee',
                fontSize: '18px',
                fontWeight: 'bold',
                color: tier.color
              }}>
                <span>Final Price ({priceInfo.period}):</span>
                <span>${priceInfo.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowBreakdown(null)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                setSelectedTier(tierKey);
                handleCheckout(tierKey);
              }}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: tier.color,
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout →'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px', color: '#1e40af' }}>
          📱 Application Services
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Custom iOS & Android apps with AI integration, deployment, and lifecycle management. Scale with confidence.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {Object.entries(tiers).map(([tierKey, tier]) => (
          <div
            key={tierKey}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: selectedTier === tierKey ? '3px solid ' + tier.color : '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              position: 'relative',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {tier.badge && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: tier.color,
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {tier.badge}
              </div>
            )}

            <h2 style={{ color: tier.color, marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
              {tier.name}
            </h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              {tier.description}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: tier.color, marginBottom: '5px' }}>
                ${tier.basePrice}
                <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666' }}>
                  {tier.period}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              {tier.features.slice(0, 6).map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: tier.color, marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#666' }}>{feature}</span>
                </div>
              ))}
              {tier.features.length > 6 && (
                <div style={{ color: '#999', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>
                  +{tier.features.length - 6} more features
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowBreakdown(tierKey)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid ' + tier.color,
                  backgroundColor: 'white',
                  color: tier.color,
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                View Details
              </button>
              <button
                onClick={() => {
                  setSelectedTier(tierKey);
                  setShowBreakdown(tierKey);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: tier.color,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Get Started →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '60px auto',
        backgroundColor: '#f0f9ff',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '60px'
      }}>
        <h3 style={{ color: '#1e40af', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
          ℹ️ Application Services Include
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>📲 Full Development</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Native iOS & Android apps built with latest technologies and best practices.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>🤖 AI Features</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              AI chatbots, predictive features, and smart automation included based on tier.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>💳 Monetization</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              In-app purchases, subscriptions, ads, and payment processing integrated.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>📊 Analytics</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Real-time user behavior tracking, conversion analytics, and custom dashboards.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>🚀 Deployment</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              App Store and Google Play publishing, version management, and release handling.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔒 Security</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Enterprise-grade security, encrypted communications, and compliance ready.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Breakdown Modal */}
      {showBreakdown && <FeatureBreakdown tierKey={showBreakdown} />}
    </div>
  );
};

export default ApplicationServicesPage;