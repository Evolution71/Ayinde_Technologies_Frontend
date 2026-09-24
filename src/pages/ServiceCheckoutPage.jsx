import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const ServiceCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Payment data from PricingPage
  const paymentData = location.state?.paymentData || localStorage.getItem('pendingPayment') 
    ? JSON.parse(localStorage.getItem('pendingPayment')) 
    : null;

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardReady, setCardReady] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    postalCode: '',
    country: 'US'
  });

  const paymentsRef = useRef(null);
  const cardRef = useRef(null);

  // Redirect if no payment data
  useEffect(() => {
    if (!paymentData) {
      navigate('/services');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize Square Card
    const initializeSquareCard = async () => {
      try {
        setLoading(true);

        // Load Square SDK if not already loaded
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = true;
          script.onload = () => setupSquare();
          document.head.appendChild(script);
        } else {
          setupSquare();
        }
      } catch (err) {
        setError('Failed to load payment system: ' + err.message);
        setLoading(false);
      }
    };

    initializeSquareCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentData, user, navigate]);

  const setupSquare = async () => {
    try {
      const appId = process.env.REACT_APP_SQUARE_APP_ID?.trim();
      if (!appId) {
        throw new Error('Square App ID not configured');
      }

      const payments = window.Square.payments(appId);
      paymentsRef.current = payments;

      const card = await payments.card();
      cardRef.current = card;

      await card.attach('#sq-card-container');
      setCardReady(true);
      setLoading(false);
    } catch (err) {
      setError('Card initialization failed: ' + err.message);
      setLoading(false);
    }
  };

  // Handle input change
  const handleBillingChange = (field, value) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cardRef.current) {
      setError('Card not initialized');
      return;
    }

    if (!billingInfo.fullName || !billingInfo.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Tokenize card
      const tokenResult = await cardRef.current.tokenize();

      if (tokenResult.status !== 'OK') {
        setError('Card error: ' + tokenResult.errors?.[0]?.message);
        setProcessing(false);
        return;
      }

      const token = tokenResult.token;

      // Create service order via backend
      const orderData = {
        tier: paymentData.tier,
        tierName: paymentData.tierName,
        amount: paymentData.finalPrice / 100, // Convert back from cents
        currency: paymentData.currency,
        paymentOption: paymentData.paymentOption,
        discountPercent: paymentData.discountPercent,
        period: paymentData.period,
        // Billing info
        fullName: billingInfo.fullName,
        email: billingInfo.email,
        phone: billingInfo.phone,
        company: billingInfo.company,
        postalCode: billingInfo.postalCode,
        country: billingInfo.country,
        // Square token
        sourceId: token
      };

      console.log('[ServiceCheckout] Submitting order:', orderData);

      // Call backend to process payment
      const response = await api.post('/services/purchase/', orderData);

      if (response.success) {
        // Clear pending payment
        localStorage.removeItem('pendingPayment');

        alert(`✅ Payment successful! \n\nWelcome to ${paymentData.tierName}!\n\nA confirmation email has been sent to ${billingInfo.email}`);
        
        // Redirect to dashboard or confirmation page
        navigate('/dashboard', { 
          state: { 
            serviceOrder: response.order,
            message: `You have successfully subscribed to ${paymentData.tierName}`
          }
        });
      } else {
        setError(response.message || 'Payment processing failed');
      }
    } catch (err) {
      console.error('[ServiceCheckout] Error:', err);
      setError('Payment failed: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Invalid checkout session</h2>
        <button onClick={() => navigate('/services')}>← Back to Services</button>
      </div>
    );
  }

  const tier = paymentData.tierName;
  const finalPrice = paymentData.finalPrice / 100;
  const originalPrice = paymentData.originalPrice / 100;
  const discount = paymentData.discountAmount / 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '20px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/services')}
          style={{
            marginBottom: '30px',
            background: 'none',
            border: 'none',
            color: '#1e40af',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          ← Back to Services
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left: Order Summary */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginTop: 0, color: '#1e40af' }}>Order Summary</h2>

            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e40af', fontSize: '20px' }}>
                  {tier}
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                  Premium Service Package
                </p>
              </div>

              <div style={{ borderTop: '1px solid #e0e7ff', paddingTop: '15px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  <span>Original Price:</span>
                  <span>${originalPrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px',
                    color: '#16a34a'
                  }}>
                    <span>Discount ({paymentData.discountPercent}%):</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  borderTop: '1px solid #e0e7ff',
                  paddingTop: '10px'
                }}>
                  <span>Final Price ({paymentData.period}):</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Features preview */}
            <div>
              <h4 style={{ marginTop: 0, marginBottom: '15px' }}>What's Included:</h4>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {paymentData.features && paymentData.features.slice(0, 8).map((feature, i) => (
                  <div key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#1e40af', fontWeight: 'bold' }}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
                {paymentData.features && paymentData.features.length > 8 && (
                  <div style={{ color: '#999', fontSize: '12px', marginTop: '10px', fontStyle: 'italic' }}>
                    +{paymentData.features.length - 8} more features
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '30px' }}>Complete Your Purchase</h2>

            {error && (
              <div style={{
                padding: '15px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                marginBottom: '20px',
                color: '#991b1b',
                border: '1px solid #fca5a5'
              }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handlePayment}>
              {/* Billing Information */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>
                  Billing Information
                </h3>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.fullName}
                    onChange={(e) => handleBillingChange('fullName', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={billingInfo.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={billingInfo.company}
                    onChange={(e) => handleBillingChange('company', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.postalCode}
                    onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                    Country *
                  </label>
                  <select
                    value={billingInfo.country}
                    onChange={(e) => handleBillingChange('country', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="US">United States</option>
                    <option value="NG">Nigeria</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>

              {/* Card Payment */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>
                  Card Details
                </h3>
                <div
                  id="sq-card-container"
                  style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    borderRadius: '6px',
                    minHeight: '50px'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || !cardReady || loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: processing || !cardReady || loading ? '#ccc' : '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: processing || !cardReady || loading ? 'not-allowed' : 'pointer',
                  marginBottom: '10px'
                }}
              >
                {processing ? '🔄 Processing Payment...' : `💳 Pay $${finalPrice.toFixed(2)}`}
              </button>

              <button
                type="button"
                onClick={() => navigate('/services')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Cancel
              </button>

              <p style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                marginTop: '15px'
              }}>
                🔒 Secure payment processing by Square<br />
                Your information is encrypted and safe
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCheckoutPage;