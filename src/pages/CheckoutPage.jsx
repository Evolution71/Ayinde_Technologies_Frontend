import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientToken, setClientToken] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [cardReady, setCardReady] = useState(false);
  
  const [billingAddress, setBillingAddress] = useState({
    postalCode: '',
    country: 'US'
  });

  const cardRef = useRef(null);
  const paymentsRef = useRef(null);
  const isMountedRef = useRef(true);

  // Main initialization
  useEffect(() => {
    let isActive = true;

    const initializeCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Checkout] Fetching course...');
        const courses = await api.getCourses();
        const selected = courses.find(c => c.id === parseInt(courseId));

        if (!isActive) return;

        if (!selected) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse(selected);

        console.log('[Checkout] Initializing payment...');
        const paymentResponse = await api.initiatePayment(
          selected.id,
          selected.price,
          selected.currency || 'USD'
        );

        if (!isActive) return;

        console.log('[Checkout] Payment initialized:', paymentResponse);
        setClientToken(paymentResponse.client_token);
        setPaymentId(paymentResponse.payment_id);

        console.log('[Checkout] Loading Square SDK...');
        if (!window.Square) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://web.squarecdn.com/v1/square.js';
            script.async = true;
            script.onload = () => {
              console.log('[Checkout] Square SDK loaded, waiting for initialization...');
              setTimeout(resolve, 3000);
            };
            script.onerror = () => reject(new Error('Failed to load Square SDK'));
            document.head.appendChild(script);
          });
        }

        if (!isActive) return;

        if (!window.Square || typeof window.Square.payments !== 'function') {
          throw new Error('Square SDK not properly initialized');
        }

        console.log('[Checkout] Square SDK ready');

        console.log('[Checkout] Initializing card form...');
        let appId = process.env.REACT_APP_SQUARE_APP_ID;
        
        console.log('[Checkout] DEBUG - Raw appId:', JSON.stringify(appId));
        console.log('[Checkout] DEBUG - appId type:', typeof appId);
        console.log('[Checkout] DEBUG - appId is set?', !!appId);
        
        appId = appId?.trim();
        
        console.log('[Checkout] DEBUG - Trimmed appId:', JSON.stringify(appId));
        console.log('[Checkout] DEBUG - Trimmed length:', appId?.length);

        if (!appId) {
          throw new Error('REACT_APP_SQUARE_APP_ID is not set');
        }

        if (!window.Square || !window.Square.payments) {
          throw new Error('Square SDK not properly loaded');
        }

        const payments = window.Square.payments(appId);
        console.log('[Checkout] Creating card instance...');
        
        let cardInstance = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            cardInstance = await payments.card();
            console.log('[Checkout] Card instance created on attempt', attempt);
            break;
          } catch (err) {
            console.log('[Checkout] Card creation attempt', attempt, 'failed:', err.message);
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              throw err;
            }
          }
        }
        
        if (!cardInstance) {
          throw new Error('Failed to create card instance after 3 attempts');
        }
        
        if (!isActive) return;

        paymentsRef.current = payments;
        cardRef.current = cardInstance;

        console.log('[Checkout] ✅ Checkout initialized successfully');
        setError(null);
        setCardReady(true);
      } catch (err) {
        if (isActive) {
          console.error('[Checkout] Initialization error:', err);
          setError(err.message || 'Failed to initialize checkout');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    initializeCheckout();

    return () => {
      isActive = false;
    };
  }, [courseId]);

  // Attach card form
  useEffect(() => {
    if (!cardReady || !cardRef.current) {
      console.log('[Checkout] Card not ready yet, waiting...');
      return;
    }

    const attachCard = async () => {
      try {
        console.log('[Checkout] Attaching card form to DOM...');
        
        const container = document.getElementById('sq-card-container');
        console.log('[Checkout] Container found?', !!container);
        
        if (!container) {
          console.error('[Checkout] Card container not found in DOM');
          setError('Card form container not found');
          return;
        }

        console.log('[Checkout] Attaching card to container...');
        console.log('[Checkout] cardRef.current has attach?', typeof cardRef.current?.attach);
        
        await cardRef.current.attach('#sq-card-container');
        
        console.log('[Checkout] ✅ Card form attached successfully');
        setError(null);
      } catch (err) {
        console.error('[Checkout] Card attachment error:', err);
        console.error('[Checkout] Error message:', err.message);
        setError(`Failed to attach card form: ${err.message}`);
      }
    };

    attachCard();
  }, [cardReady]);

  // Handle payment
  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      console.log('[Checkout] Payment handler called');
      console.log('[Checkout] cardRef.current exists?', !!cardRef.current);
      console.log('[Checkout] paymentsRef.current exists?', !!paymentsRef.current);
      
      if (!cardRef.current) {
        throw new Error('Payment form not ready - card reference missing');
      }

      if (!paymentsRef.current) {
        throw new Error('Payment form not ready - payments reference missing');
      }

      // Validate billing address
      if (!billingAddress.postalCode || billingAddress.postalCode.trim() === '') {
        throw new Error('Postal code is required');
      }

      if (!billingAddress.country || billingAddress.country.trim() === '') {
        throw new Error('Country is required');
      }

      console.log('[Checkout] Billing address:', billingAddress);
      console.log('[Checkout] Postal Code value:', billingAddress.postalCode);
      console.log('[Checkout] Country value:', billingAddress.country);
      console.log('[Checkout] Postal Code type:', typeof billingAddress.postalCode);
      console.log('[Checkout] Country type:', typeof billingAddress.country);
      console.log('[Checkout] Requesting card token using card.tokenize()...');
      
      let tokenResult;
      try {
        console.log('[Checkout] Calling card.tokenize() without verification details...');
        tokenResult = await cardRef.current.tokenize();
        
        if (!tokenResult || !tokenResult.token) {
          throw new Error('No token returned from tokenize()');
        }
      } catch (err) {
        console.error('[Checkout] Tokenize error:', err);
        console.error('[Checkout] Error details:', err.message);
        throw new Error(`Failed to tokenize card: ${err.message}`);
      }

      if (tokenResult.status !== 'OK') {
        console.error('[Checkout] Card tokenize failed:', tokenResult.errors);
        throw new Error('Failed to tokenize card - ' + (tokenResult.errors?.[0]?.message || 'Unknown error'));
      }

      const nonce = tokenResult.token;
      console.log('[Checkout] Token received:', nonce);
      console.log('[Checkout] Verifying payment with billing address...');

      const verifyResult = await api.verifyPayment(paymentId, nonce, {
        billingPostalCode: billingAddress.postalCode,
        billingCountry: billingAddress.country
      });

      if (verifyResult.success || verifyResult.status === 'success') {
        console.log('[Checkout] ✅ Payment successful');
        
        if (isMountedRef.current) {
          setTimeout(() => {
            navigate('/');
            alert('✅ Payment successful! You are now enrolled in the course.');
          }, 500);
        }
      } else {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('[Checkout] Payment error:', err);
      
      if (isMountedRef.current) {
        setError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      if (isMountedRef.current) {
        setProcessing(false);
      }
    }
  };

  // Track mount state
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">Loading checkout...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="checkout-container">
        <div className="checkout-error">
          {error || 'Course not found'}
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-summary">
          <h1>Review Your Purchase</h1>

          {course.icon && (
            <div className="course-image">
              <img src={course.icon} alt={course.title} />
            </div>
          )}

          <div className="course-details">
            <h2>{course.title}</h2>
            {course.instructor && (
              <p className="instructor">Instructor: {course.instructor}</p>
            )}
            <p className="description">{course.description}</p>
            {course.duration && <p className="duration">Duration: {course.duration}</p>}
            {course.level && <p className="level">Level: {course.level}</p>}
          </div>

          <div className="price-breakdown">
            <div className="price-item">
              <span>Course Price:</span>
              <span className="amount">
                {course.currency || 'USD'} {course.price.toFixed(2)}
              </span>
            </div>
            <div className="price-item total">
              <span>Total:</span>
              <span className="amount">
                {course.currency || 'USD'} {course.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="checkout-form">
          <h2>Payment Details</h2>

          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
            </div>
          )}

          {!error && clientToken ? (
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label htmlFor="sq-card-container">Card Information</label>
                <div id="sq-card-container" className="card-container"></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postal-code">Postal Code</label>
                  <input
                    type="text"
                    id="postal-code"
                    placeholder="12345"
                    value={billingAddress.postalCode}
                    onChange={(e) => {
                      console.log('[Checkout] Postal code changed:', e.target.value);
                      setBillingAddress({...billingAddress, postalCode: e.target.value});
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    placeholder="US"
                    value={billingAddress.country}
                    onChange={(e) => {
                      console.log('[Checkout] Country changed:', e.target.value);
                      setBillingAddress({...billingAddress, country: e.target.value});
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || !clientToken}
                className="btn-pay-large"
              >
                {processing ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Pay ${course.currency || 'USD'} ${course.price.toFixed(2)}`
                )}
              </button>

              <p className="security-note">
                🔒 Your payment is secure and encrypted by Square
              </p>
            </form>
          ) : (
            <div className="loading-form">
              <span className="spinner"></span>
              Initializing payment form...
            </div>
          )}

          <button
            type="button"
            className="btn-cancel-checkout"
            onClick={() => navigate('/')}
            disabled={processing}
          >
            Cancel & Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;