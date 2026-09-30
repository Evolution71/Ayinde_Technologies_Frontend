import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PremiumServicesPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('supreme');
  const [paymentOption, setPaymentOption] = useState('monthly');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const tiers = {
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
      icon: '👑',
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
        'Custom Integration Services',
        'Dedicated Account Manager'
      ]
    }
  };

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
      basePrice = (tier.basePrice * 6) / 2;
      period = '50% down + 6 months';
    }

    const discount = (basePrice * discountPercent) / 100;
    const finalPrice = basePrice - discount;

    return { price: finalPrice, discount, period, basePrice };
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
        service: 'premium',
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
          {/* Header */}
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

          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            {tier.description}
          </p>

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
                <option value="monthly">Monthly - ${tiers.supreme.basePrice}/month</option>
                <option value="annual">Annual - ${tiers.supreme.annualPrice}/2 years</option>
                <option value="threeyear">One-Time 3 Years - ${tiers.supreme.threeyearPrice}</option>
                <option value="halfdown">50% Down + 6 Months (${Math.round(tiers.supreme.basePrice * 6 / 2)}/month)</option>
              </select>
            </div>

            {/* Discount Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Special Offer (30 days):
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
              handleCheckout('supreme');
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
            👑 Supreme VIP Platinum Package
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            The ultimate all-in-one enterprise solution for serious businesses
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            ✅ Website + App Development | ✅ Enterprise Support | ✅ Advanced AI
          </p>
        </div>

        {/* Main Feature Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: `3px solid ${tiers.supreme.color}`,
          marginBottom: '60px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👑</div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: tiers.supreme.color, marginBottom: '10px' }}>
              Supreme VIP Platinum
            </h2>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Complete website & application development with enterprise support
            </p>
          </div>

          {/* Pricing Options */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              Flexible Payment Options:
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                <option value="monthly">Monthly - $2,394/month</option>
                <option value="annual">Annual Plan - $50,000 for 2 years (saves $7,528)</option>
                <option value="threeyear">One-Time Payment - $50,000 for 3 years (saves $22,232)</option>
                <option value="halfdown">50% Down - $7,182 down + $1,197/month for 6 months</option>
              </select>
            </div>

            {/* Discount Options */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Limited Time Offer (30 days):
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[0, 5, 10, 20].map((discount) => (
                  <button
                    key={discount}
                    onClick={() => setDiscountPercent(discount)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: discountPercent === discount ? `2px solid ${tiers.supreme.color}` : '1px solid #ddd',
                      backgroundColor: discountPercent === discount ? tiers.supreme.color + '20' : 'white',
                      color: discountPercent === discount ? tiers.supreme.color : '#333',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {discount === 0 ? 'No Discount' : `${discount}% OFF`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div style={{
            backgroundColor: tiers.supreme.color + '10',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: `2px solid ${tiers.supreme.color}`
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: tiers.supreme.color }}>
              Price Summary:
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontWeight: '500' }}>Original Price:</p>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#333' }}>
                  ${calculatePrice(tiers.supreme).basePrice.toFixed(2)}
                </p>
              </div>
              {discountPercent > 0 && (
                <div>
                  <p style={{ margin: '0 0 8px 0', color: '#16a34a', fontWeight: '500' }}>
                    Discount ({discountPercent}%):
                  </p>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#16a34a' }}>
                    -${calculatePrice(tiers.supreme).discount.toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <p style={{ margin: '0 0 8px 0', color: tiers.supreme.color, fontWeight: '700' }}>Final Price:</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: tiers.supreme.color }}>
                  ${calculatePrice(tiers.supreme).price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowBreakdown('supreme')}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 32px',
                backgroundColor: tiers.supreme.color,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              View All Features
            </button>
            <button
              onClick={() => handleCheckout('supreme')}
              disabled={loading}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 32px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#15803d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }}
            >
              {loading ? 'Processing...' : 'Get Started Now'}
            </button>
          </div>
        </div>

        {/* Why This Package */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            Why Choose Supreme VIP Platinum?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: tiers.supreme.color, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                Complete Solution
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Website AND application development in one package - no need for separate vendors
              </p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: tiers.supreme.color, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                Enterprise Support
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                24/7 dedicated support with rapid bug fixes and priority feature development
              </p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: tiers.supreme.color, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                Advanced AI
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Latest AI functions and chatbot capabilities to give you competitive advantage
              </p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: tiers.supreme.color, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                Dedicated Account Manager
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                A single point of contact for all your needs and quarterly strategy reviews
              </p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: tiers.supreme.color, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                Monetization
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Complete deployment and monetization support for your applications
              </p>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: tiers.supreme.color, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                Flexible Payment
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Multiple payment options: monthly, annual, or 3-year one-time payment
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBreakdown && <FeatureBreakdown tierKey={showBreakdown} />}
    </div>
  );
};

export default PremiumServicesPage;