import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Billing address state
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingCountry, setBillingCountry] = useState('US');

  // Square references
  const paymentsRef = useRef(null);
  const cardRef = useRef(null);
  const [cardReady, setCardReady] = useState(false);

  // Initialize payment
  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log('[Checkout] Fetching course...');
        setLoading(true);

        if (!user) {
          navigate('/login');
          return;
        }

        // Get course
        const courses = await api.getCourses();
        const foundCourse = courses.find(c => c.id == courseId);
        if (!foundCourse) {
          setError('Course not found');
          return;
        }
        setCourse(foundCourse);

        // Initiate payment (get payment_id)
        console.log('[Checkout] Initializing payment...');
        const paymentData = await api.initiatePayment(courseId, foundCourse.price, 'USD');
        console.log('[Checkout] Payment initialized:', paymentData);
        setPaymentId(paymentData.payment_id);

        // Load Square SDK
        console.log('[Checkout] Loading Square SDK...');
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.onload = () => {
            console.log('[Checkout] Square SDK ready');
            resolve();
          };
          script.onerror = () => {
            setError('Failed to load Square SDK');
            resolve();
          };
          document.head.appendChild(script);
        });
      } catch (err) {
        console.error('[Checkout] Init error:', err);
        setError(err.message);
      }
    };

    initializePayment().then(() => setLoading(false));
  }, [courseId, user, navigate]);

  // Initialize card after SDK loads
  useEffect(() => {
    if (!window.Square || !paymentId) return;

    const initCard = async () => {
      try {
        console.log('[Checkout] Initializing card form...');

        const appId = process.env.REACT_APP_SQUARE_APP_ID?.trim();
        console.log('[Checkout] DEBUG - Raw appId:', appId);
        console.log('[Checkout] DEBUG - appId type:', typeof appId);
        console.log('[Checkout] DEBUG - appId is set?', !!appId);

        if (!appId) {
          setError('Square App ID not configured');
          return;
        }

        console.log('[Checkout] DEBUG - Trimmed appId:', appId);
        console.log('[Checkout] DEBUG - Trimmed length:', appId.length);

        // Create payments instance
        console.log('[Checkout] Creating payments instance...');
        const payments = window.Square.payments(appId);
        paymentsRef.current = payments;

        // Create card instance
        console.log('[Checkout] Creating card instance...');
        const card = await payments.card();
        cardRef.current = card;
        console.log('[Checkout] Card instance created');

        // Attach card to DOM
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('[Checkout] Attaching card form to DOM...');
        const container = document.getElementById('sq-card-container');
        console.log('[Checkout] Container found?', !!container);

        if (!container) {
          setError('Card container not found');
          return;
        }

        console.log('[Checkout] Attaching card to container...');
        console.log('[Checkout] cardRef.current has attach?', typeof cardRef.current?.attach);

        await cardRef.current.attach('#sq-card-container');
        console.log('[Checkout] ✅ Card form attached successfully');

        setCardReady(true);
      } catch (err) {
        console.error('[Checkout] Card init error:', err);
        setError('Failed to initialize card: ' + err.message);
      }
    };

    initCard();
  }, [paymentId]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cardRef.current) {
      setError('Card not initialized');
      return;
    }

    try {
      setProcessing(true);
      console.log('[Checkout] Processing payment...');

      // ✅ CORRECT METHOD: card.tokenize()
      console.log('[Checkout] Calling card.tokenize()...');
      const tokenResult = await cardRef.current.tokenize();

      if (tokenResult.status !== 'OK') {
        setError('Card tokenization failed: ' + tokenResult.errors?.[0]?.message);
        setProcessing(false);
        return;
      }

      const token = tokenResult.token;
      console.log('[Checkout] ✅ Token received:', token.substring(0, 20) + '...');

      // Verify payment with backend
      console.log('[Checkout] Verifying payment with backend...');
      const result = await api.verifyPayment(paymentId, token, {
        billingPostalCode,
        billingCountry
      });

      console.log('[Checkout] ✅ Payment verified:', result);

      alert('✅ Payment successful! Welcome to the course!');
      navigate('/courses');
    } catch (err) {
      console.error('[Checkout] Payment error:', err);
      setError('Payment failed: ' + err.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading checkout...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: 'red' }}>Error: {error}</h2>
        <button
          onClick={() => navigate('/courses')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        <h1 style={{ marginTop: 0 }}>💳 Checkout</h1>

        {course && (
          <>
            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{course.title}</h3>
              <p style={{ color: '#666', margin: 0 }}>30-day free trial, then ${course.price}/year</p>
            </div>

            <form onSubmit={handlePayment}>
              {/* Card */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Card Details
                </label>
                <div
                  id="sq-card-container"
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '12px',
                    minHeight: '50px',
                    backgroundColor: '#fafafa'
                  }}
                />
              </div>

              {/* Postal Code */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={billingPostalCode}
                  onChange={(e) => setBillingPostalCode(e.target.value)}
                  placeholder="12345"
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

              {/* Country */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Country
                </label>
                <select
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
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
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="NG">Nigeria</option>
                </select>
              </div>

              {/* Amount */}
              <div style={{
                padding: '15px',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                marginBottom: '20px',
                border: '1px solid #bfdbfe'
              }}>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>Total Amount</p>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
                  ${course.price}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  color: '#dc2626',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="submit"
                disabled={processing || !cardReady}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: processing || !cardReady ? '#ccc' : '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: processing || !cardReady ? 'default' : 'pointer'
                }}
              >
                {processing ? 'Processing...' : `Pay $${course.price}`}
              </button>

              <button
                type="button"
                onClick={() => navigate('/courses')}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '10px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ← Back to Courses
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;