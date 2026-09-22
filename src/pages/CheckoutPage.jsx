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
  const [cardReady, setCardReady] = useState(false);  // ← NEW!

  // Refs to track component state
  const cardRef = useRef(null);
  const paymentsRef = useRef(null);
  const isMountedRef = useRef(true);

  // Main initialization effect
  useEffect(() => {
    let isActive = true;

    const initializeCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch course
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

        // Step 2: Initialize payment
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

        // Step 3: Load Square SDK
        console.log('[Checkout] Loading Square SDK...');
        if (!window.Square) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://web.squarecdn.com/v1/square.js';
            script.async = true;
            script.onload = () => {
              // Give SDK much more time to fully initialize
              console.log('[Checkout] Square SDK loaded, waiting for initialization...');
              setTimeout(resolve, 1500);
            };
            script.onerror = () => reject(new Error('Failed to load Square SDK'));
            document.head.appendChild(script);
          });
        }

        if (!isActive) return;

        // Verify Square.payments is available
        if (!window.Square || typeof window.Square.payments !== 'function') {
          throw new Error('Square SDK not properly initialized - payments function not available');
        }

        console.log('[Checkout] Square SDK ready');

        // Step 4: Initialize card form
        console.log('[Checkout] Initializing card form...');
        let appId = process.env.REACT_APP_SQUARE_APP_ID;
        
        // Debug: Log environment variable
        console.log('[Checkout] DEBUG - Raw appId:', JSON.stringify(appId));
        console.log('[Checkout] DEBUG - appId type:', typeof appId);
        console.log('[Checkout] DEBUG - appId is set?', !!appId);
        
        // TRIM whitespace
        appId = appId?.trim();
        
        console.log('[Checkout] DEBUG - Trimmed appId:', JSON.stringify(appId));
        console.log('[Checkout] DEBUG - Trimmed length:', appId?.length);

        if (!appId) {
          throw new Error('Payment system not configured - REACT_APP_SQUARE_APP_ID is not set');
        }

        // Ensure Square.payments is available
        if (!window.Square || !window.Square.payments) {
          throw new Error('Square SDK not properly loaded');
        }

        const payments = window.Square.payments(appId);
        console.log('[Checkout] Creating card instance...');
        
        // Retry card creation up to 3 times
        let cardInstance = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            cardInstance = await payments.card();
            console.log('[Checkout] Card instance created on attempt', attempt);
            break;
          } catch (err) {
            console.log('[Checkout] Card creation attempt', attempt, 'failed:', err.message);
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 500));
            } else {
              throw err;
            }
          }
        }
        
        if (!cardInstance) {
          throw new Error('Failed to create card instance after 3 attempts');
        }
        
        if (!isActive) return;

        // Store both payments and card instances
        window.squarePayments = payments;
        window.squareCard = cardInstance;

        console.log('[Checkout] ✅ Checkout initialized successfully');
        setError(null);
        setCardReady(true);  // ← SIGNAL THAT CARD IS READY!
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

    // Cleanup
    return () => {
      isActive = false;
    };
  }, [courseId]);

  // Attach card form once card is ready
  useEffect(() => {
    if (!cardReady || !window.squareCard) {
      console.log('[Checkout] Card not ready yet, waiting...');
      return;
    }

    const attachCard = async () => {
      try {
        console.log('[Checkout] Attaching card form to DOM...');
        
        // Verify container exists
        const container = document.getElementById('sq-card-container');
        console.log('[Checkout] Container found?', !!container);
        
        if (!container) {
          console.error('[Checkout] ❌ Card container not found in DOM');
          setError('Card form container not found');
          return;
        }

        console.log('[Checkout] Attaching squareCard to container...');
        await window.squareCard.attach('#sq-card-container');
        
        console.log('[Checkout] Storing card reference for payment...');
        cardRef.current = window.squareCard;
        paymentsRef.current = window.squarePayments;
        
        console.log('[Checkout] ✅ Card form attached successfully');
        setError(null);
      } catch (err) {
        console.error('[Checkout] ❌ Card attachment error:', err);
        console.error('[Checkout] Error message:', err.message);
        setError(`Failed to attach card form: ${err.message}`);
      }
    };

    attachCard();
  }, [cardReady]);

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      console.log('[Checkout] Payment handler called');
      console.log('[Checkout] cardRef.current exists?', !!cardRef.current);
      console.log('[Checkout] cardRef.current.requestCardNonce exists?', !!cardRef.current?.requestCardNonce);
      
      if (!cardRef.current) {
        throw new Error('Payment form not ready - card reference missing');
      }

      if (typeof cardRef.current.requestCardNonce !== 'function') {
        console.error('[Checkout] cardRef.current methods:', Object.getOwnPropertyNames(cardRef.current));
        throw new Error('Payment form not ready - requestCardNonce method not available');
      }

      console.log('[Checkout] Requesting card nonce...');
      const result = await cardRef.current.requestCardNonce();

      if (result.status !== 'OK') {
        throw new Error('Failed to process card');
      }

      const nonce = result.details.cardNonce;
      console.log('[Checkout] Verifying payment...');

      const verifyResult = await api.verifyPayment(paymentId, nonce);

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

  // Track component mount state
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">Loading checkout...</div>
      </div>
    );
  }

  // Render error state
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

  // Render checkout page
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Side: Course Summary */}
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

        {/* Right Side: Payment Form */}
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