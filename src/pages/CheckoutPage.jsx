import React, { useState, useEffect } from 'react';
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

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courses = await api.getCourses();
        const selected = courses.find(c => c.id === parseInt(courseId));
        if (!selected) {
          setError('Course not found');
        } else {
          setCourse(selected);
          initializePayment(selected);
        }
      } catch (err) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Initialize payment
  const initializePayment = async (courseData) => {
    try {
      // Load Square SDK
      if (!window.Square) {
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise(resolve => {
          script.onload = resolve;
        });
      }

      // Create payment intent
      const response = await api.initiatePayment(
        courseData.id,
        courseData.price,
        courseData.currency || 'USD'
      );

      setClientToken(response.client_token);
      setPaymentId(response.payment_id);
    } catch (err) {
      setError(err.message || 'Failed to initialize payment');
    }
  };

  // Initialize card when client token is ready
  useEffect(() => {
    if (!clientToken || !window.Square) return;

    const initializeCard = async () => {
      try {
        const payments = window.Square.payments(process.env.REACT_APP_SQUARE_APP_ID);
        const card = await payments.card();
        await card.attach('#sq-card-container');
        window.squareCard = card;
      } catch (err) {
        setError('Failed to initialize payment form');
      }
    };

    initializeCard();
  }, [clientToken]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      if (!window.squareCard) {
        throw new Error('Card not ready');
      }

      // Request nonce
      const result = await window.squareCard.requestCardNonce();

      if (result.status === 'OK') {
        const nonce = result.details.cardNonce;

        // Verify payment
        const paymentResult = await api.verifyPayment(paymentId, nonce);

        if (paymentResult.success || paymentResult.status === 'success') {
          // Success! Redirect to dashboard
          setTimeout(() => {
            navigate('/');
            alert('✅ Payment successful! You are now enrolled in the course.');
          }, 500);
        } else {
          setError(paymentResult.message || 'Payment verification failed');
        }
      } else {
        setError('Failed to process card. Please check your information.');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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
            {course.instructor && <p className="instructor">Instructor: {course.instructor}</p>}
            <p className="description">{course.description}</p>
            {course.duration && <p className="duration">Duration: {course.duration}</p>}
            {course.level && <p className="level">Level: {course.level}</p>}
          </div>

          <div className="price-breakdown">
            <div className="price-item">
              <span>Course Price:</span>
              <span className="amount">{course.currency || 'USD'} {course.price.toFixed(2)}</span>
            </div>
            <div className="price-item total">
              <span>Total:</span>
              <span className="amount">{course.currency || 'USD'} {course.price.toFixed(2)}</span>
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

          {clientToken ? (
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