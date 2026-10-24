import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
};

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
];

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' };

function readPendingPayment() {
  try {
    return JSON.parse(localStorage.getItem('pendingPayment'));
  } catch {
    return null;
  }
}

function ServiceCheckoutForm({ paymentData, user }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    postalCode: '',
    country: 'US',
  });

  const finalPrice = paymentData.finalPrice / 100;

  const handleBillingChange = (field, value) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.postalCode) {
      setError('Please fill in all required fields (name, email, postal code).');
      return;
    }

    if (!cardComplete) {
      setError('Please enter your complete card details.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Turn the card into a Stripe PaymentMethod. Card data goes straight to Stripe, not to our server.
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: billingInfo.fullName,
          email: billingInfo.email,
          phone: billingInfo.phone || undefined,
          address: {
            postal_code: billingInfo.postalCode,
            country: billingInfo.country,
          },
        },
      });

      if (pmError) {
        setError(pmError.message || 'Card error. Please check your details.');
        return;
      }

      // 2. Send the PaymentMethod id to the backend, which charges it
      const response = await api.createServicePurchase({
        serviceType: paymentData.serviceType || 'website',
        tier: paymentData.tier,
        tierName: paymentData.tierName,
        amount: finalPrice,
        currency: paymentData.currency,
        paymentOption: paymentData.paymentOption,
        hours: paymentData.hours,
        discountPercent: paymentData.discountPercent,
        period: paymentData.period,
        fullName: billingInfo.fullName,
        email: billingInfo.email,
        phone: billingInfo.phone,
        company: billingInfo.company,
        postalCode: billingInfo.postalCode,
        country: billingInfo.country,
        sourceId: paymentMethod.id,
      });

      if (response.success) {
        localStorage.removeItem('pendingPayment');

        alert(
          `✅ Payment successful!\n\nWelcome to ${paymentData.tierName}!\n\nA confirmation email has been sent to ${billingInfo.email}`
        );

        navigate('/dashboard', {
          state: {
            serviceOrder: response.order,
            message: `You have successfully subscribed to ${paymentData.tierName}`,
          },
        });
        return;
      }

      setError(response.message || 'Payment processing failed.');
    } catch (err) {
      console.error('[ServiceCheckout] Error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const submitDisabled = processing || !stripe || !cardComplete;

  return (
    <form onSubmit={handlePayment}>
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#991b1b',
          border: '1px solid #fca5a5',
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>Billing Information</h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={billingInfo.fullName}
            onChange={(e) => handleBillingChange('fullName', e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            value={billingInfo.email}
            onChange={(e) => handleBillingChange('email', e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Phone</label>
          <input
            type="tel"
            value={billingInfo.phone}
            onChange={(e) => handleBillingChange('phone', e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Company</label>
          <input
            type="text"
            value={billingInfo.company}
            onChange={(e) => handleBillingChange('company', e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Postal Code *</label>
          <input
            type="text"
            value={billingInfo.postalCode}
            onChange={(e) => handleBillingChange('postalCode', e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Country *</label>
          <select
            value={billingInfo.country}
            onChange={(e) => handleBillingChange('country', e.target.value)}
            style={inputStyle}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>Card Details</h3>
        <div style={{
          border: '1px solid #ddd',
          padding: '12px',
          borderRadius: '6px',
          minHeight: '50px',
        }}>
          <CardElement
            options={CARD_OPTIONS}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) setError(e.error.message);
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitDisabled}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: submitDisabled ? '#ccc' : '#1e40af',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: submitDisabled ? 'not-allowed' : 'pointer',
          marginBottom: '10px',
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
          fontSize: '14px',
        }}
      >
        ← Cancel
      </button>

      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '15px' }}>
        🔒 Secure payment processing by Stripe<br />
        Your card details are sent directly to Stripe and never stored on our servers
      </p>
    </form>
  );
}

export default function ServiceCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  // Read once on mount so the object stays stable across renders
  const [paymentData] = useState(
    () => location.state?.paymentData || readPendingPayment()
  );

  useEffect(() => {
    // Wait for AuthContext to restore the stored session before deciding
    // the visitor is logged out; otherwise a refresh bounces them to /login.
    if (authLoading) return;
    if (!paymentData) {
      navigate('/services');
    } else if (!user) {
      navigate('/login');
    }
  }, [authLoading, paymentData, user, navigate]);

  if (!paymentData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Invalid checkout session</h2>
        <button onClick={() => navigate('/services')}>← Back to Services</button>
      </div>
    );
  }

  const originalPrice = paymentData.originalPrice / 100;
  const discount = paymentData.discountAmount / 100;
  const finalPrice = paymentData.finalPrice / 100;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '20px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <button
          onClick={() => navigate('/services')}
          style={{
            marginBottom: '30px',
            background: 'none',
            border: 'none',
            color: '#1e40af',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          ← Back to Services
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left: Order Summary */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginTop: 0, color: '#1e40af' }}>Order Summary</h2>

            <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e40af', fontSize: '20px' }}>{paymentData.tierName}</h3>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Premium Service Package</p>
              </div>

              <div style={{ borderTop: '1px solid #e0e7ff', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Original Price:</span>
                  <span>${originalPrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#16a34a' }}>
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
                  paddingTop: '10px',
                }}>
                  <span>Final Price ({paymentData.period}):</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

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
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '30px' }}>Complete Your Purchase</h2>

            <Elements stripe={stripePromise}>
              <ServiceCheckoutForm paymentData={paymentData} user={user} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}