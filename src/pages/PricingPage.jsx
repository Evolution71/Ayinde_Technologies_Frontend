import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const PricingPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentOption, setPaymentOption] = useState('monthly');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pricing data
  const tiers = {
    website: {
      name: 'Website Pro',
      basePrice: 897,
      period: '/month',
      description: 'Professional Website Solutions',
      color: '#3b82f6',
      features: [
        'Open Web Concept Research & Design',
        'Latest Website Creation & Development',
        'Web Analytics & Monitoring',
        'Basic AI Functions Integration',
        'Search Engine Optimization (SEO)',
        'Google Reviews Management',
        'Website Management & Updates',
        'Bug Fixes & Support',
        'Monthly Performance Reports'
      ]
    },
    application: {
      name: 'Application Pro',
      basePrice: 1497,
      period: '/month',
      description: 'Complete Mobile & Web App Development',
      color: '#8b5cf6',
      features: [
        'All Website Pro Features',
        'Open App Concept Research & Design',
        'Latest Application Creation & Development',
        'Advanced AI Functions',
        'Advanced Chatbot AI Integration',
        'AI Engine Optimization',
        'Apple Store Compatibility',
        'Google Play Store Compatibility',
        'Application Deployment & Monetization',
        'Application Management & Updates',
        '24/7 Support & Diagnostics',
        'Rapid Bug Repairs',
        'Monthly Performance Reports'
      ]
    },
    supreme: {
      name: 'Supreme VIP Platinum',
      basePrice: 2394,
      period: '/month',
      annualPrice: 50000,
      annualPeriod: '/2 years',
      threeyearPrice: 50000,
      threeyearPeriod: '/3 years (one-time)',
      description: 'Ultimate All-In-One Enterprise Solution',
      color: '#f59e0b',
      features: [
        'Open Web/App Concept Research & Design from Beginning to End',
        'Latest Website Creation & Development',
        'Latest Application Creation & Development',
        'Web/App Analytics, Growth and Monitoring',
        'Latest Advanced AI Functions',
        'Latest Advanced Chatbot AI Functions',
        'Search Engine Optimization (SEO)',
        'AI Engine Optimization',
        'Google Reviews Management',
        'Apple Store & Google Play Store Compatibility',
        'Application Deployment & Monetization',
        'Website & Application Management & Regular Updates',
        '24/7 Rapid Bug Repairs',
        '24/7 Constant Support, Diagnostics & Updates',
        'Priority Feature Development',
        'Quarterly Strategy Reviews',
        'Custom Integration Services'
      ]
    }
  };

  // Calculate price based on tier and options
  const calculatePrice = (tier) => {
    if (!tier) return 0;
    
    let basePrice = 0;
    let period = 'monthly';

    if (paymentOption === 'monthly') {
      basePrice = tier.basePrice;
      period = 'monthly';
    } else if (paymentOption === 'annual' && tier.annualPrice) {
      basePrice = tier.annualPrice;
      period = '2 years';
    } else if (paymentOption === 'threeyear' && tier.threeyearPrice) {
      basePrice = tier.threeyearPrice;
      period = '3 years';
    } else if (paymentOption === 'halfdown' && tier.basePrice) {
      basePrice = (tier.basePrice * 6) / 2; // 50% down for 6 months
      period = '50% down + 6 months';
    }

    const discount = (basePrice * discountPercent) / 100;
    const finalPrice = basePrice - discount;

    return { price: finalPrice, discount, period, basePrice };
  };

  // Handle proceed to checkout
  const handleCheckout = async (tierKey) => {
    if (!selectedTier) {
      alert('Please select a tier first');
      return;
    }

    setLoading(true);

    try {
      const tier = tiers[tierKey];
      const priceInfo = calculatePrice(tier);

      // Create payment request
      const paymentData = {
        tier: tierKey,
        tierName: tier.name,
        amount: Math.round(priceInfo.price * 100), // Convert to cents for Square
        currency: 'USD',
        paymentOption: paymentOption,
        discountPercent: discountPercent,
        discountAmount: Math.round(priceInfo.discount * 100),
        originalPrice: Math.round(priceInfo.basePrice * 100),
        finalPrice: Math.round(priceInfo.price * 100),
        period: priceInfo.period,
        features: tier.features
      };

      // Store payment data in session/localStorage
      localStorage.setItem('pendingPayment', JSON.stringify(paymentData));

      // Redirect to checkout
      navigate('/checkout', { state: { paymentData } });
    } catch (err) {
      console.error('Error preparing checkout:', err);
      alert('Error preparing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render feature breakdown modal
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
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: tier.color, marginBottom: '10px' }}>
              {tier.name}
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {tier.description}
            </p>
          </div>

          {/* Features List */}
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

          {/* Price Breakdown */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
              Pricing Breakdown:
            </h3>

            {/* Payment Option Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Payment Option:
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
                {tierKey === 'website' || tierKey === 'application' ? (
                  <>
                    <option value="monthly">Monthly ${tier.basePrice}/month</option>
                    <option value="halfdown">50% Down + 6 Months (${Math.round(tier.basePrice * 6 / 2)}/month)</option>
                  </>
                ) : (
                  <>
                    <option value="monthly">Monthly - ${tier.basePrice}/month</option>
                    <option value="annual">Annual - ${tier.annualPrice}/2 years</option>
                    <option value="threeyear">One-Time 3 Years - ${tier.threeyearPrice}</option>
                    <option value="halfdown">50% Down + 6 Months (${Math.round(tier.basePrice * 6 / 2)}/month)</option>
                  </>
                )}
              </select>
            </div>

            {/* Discount Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Special Offer (30 days):
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

            {/* Price Display */}
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

          {/* Action Buttons */}
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
          🚀 Premium Services Pricing
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Choose the perfect plan for your business. All plans include comprehensive support and regular updates.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Badge */}
            {tierKey === 'supreme' && (
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
                BEST VALUE 💎
              </div>
            )}

            {/* Tier Name */}
            <h2 style={{ color: tier.color, marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
              {tier.name}
            </h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              {tier.description}
            </p>

            {/* Price Display */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: tier.color, marginBottom: '5px' }}>
                ${tier.basePrice}
                <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666' }}>
                  {tier.period}
                </span>
              </div>
              {tier.annualPrice && (
                <p style={{ color: '#999', fontSize: '12px' }}>
                  Or ${tier.annualPrice}/2 years | ${tier.threeyearPrice} for 3 years (one-time)
                </p>
              )}
            </div>

            {/* Feature Preview */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              {tier.features.slice(0, 5).map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: tier.color, marginRight: '8px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#666' }}>{feature}</span>
                </div>
              ))}
              {tier.features.length > 5 && (
                <div style={{ color: '#999', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>
                  +{tier.features.length - 5} more features
                </div>
              )}
            </div>

            {/* Buttons */}
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
        padding: '0 20px',
        backgroundColor: '#f0f9ff',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '60px'
      }}>
        <h3 style={{ color: '#1e40af', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
          ℹ️ About Our Pricing
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>💰 Flexible Payment Plans</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Monthly billing or annual/multi-year options. 50% down payment plans available for qualified clients.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎁 Limited Time Offers</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Get 5%, 10%, or 20% off when you sign up within the next 30 days. Offer valid for new customers only.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔄 Money-Back Guarantee</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              30-day money-back guarantee if you're not satisfied. No questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Breakdown Modal */}
      {showBreakdown && <FeatureBreakdown tierKey={showBreakdown} />}
    </div>
  );
};

export default PricingPage;