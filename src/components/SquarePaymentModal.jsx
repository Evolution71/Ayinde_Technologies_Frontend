import React, { useState, useEffect } from 'react';
import { api } from '../api';

const SquarePaymentModal = ({ course, onClose }) => {
  const [clientToken, setClientToken] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Initialize payment on mount
  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Square Web Payments SDK
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise(resolve => {
            script.onload = resolve;
          });
        }

        // Create payment intent with amount and currency
        // FIXED: Pass amount and currency to initiatePayment
        const response = await api.initiatePayment(
          course.id,
          course.price,
          course.currency || 'USD'
        );
        
        // Response should have: { client_token, payment_id, ... }
        setClientToken(response.client_token);
        setPaymentId(response.payment_id);
        setError(null);
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError(err.message || 'Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [course.id, course.price, course.currency]);

  // Initialize Web Payments SDK when client token is ready
  useEffect(() => {
    if (!clientToken || !window.Square) return;

    initializeWebPayments();
  }, [clientToken]);

  const initializeWebPayments = async () => {
    try {
      const payments = window.Square.payments(
        process.env.REACT_APP_SQUARE_APP_ID
      );

      // Create card payment method
      const card = await payments.card();
      await card.attach('#sq-card-container');

      // Store card instance for later use
      window.squareCard = card;
    } catch (err) {
      console.error('Error initializing card:', err);
      setError('Failed to initialize card payment');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      if (!window.squareCard) {
        throw new Error('Card not initialized');
      }

      const card = window.squareCard;

      // Request card nonce
      const result = await card.requestCardNonce();

      if (result.status === 'OK') {
        const nonce = result.details.cardNonce;

        // Complete payment
        // FIXED: Pass payment_id and nonce instead of transaction_id
        const paymentResult = await api.verifyPayment(
          paymentId,
          nonce
        );

        if (paymentResult.success || paymentResult.status === 'success') {
          alert('✅ Payment successful! You are now enrolled in the course.');
          onClose();
        } else {
          setError(paymentResult.message || 'Payment verification failed. Please try again.');
        }
      } else {
        setError('Failed to process card. Please check your information and try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again or contact support.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Your Purchase</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Course Summary */}
          <div className="course-summary">
            <div className="summary-item">
              <span>Course:</span>
              <span className="summary-value">{course.title}</span>
            </div>
            {course.description && (
              <div className="summary-item">
                <span>Description:</span>
                <span className="summary-value">{course.description}</span>
              </div>
            )}
            <div className="summary-item">
              <span>Price:</span>
              <span className="summary-value">
                {course.currency || 'USD'} {course.price.toFixed(2)}
              </span>
            </div>
            {course.instructor && (
              <div className="summary-item">
                <span>Instructor:</span>
                <span className="summary-value">{course.instructor}</span>
              </div>
            )}
          </div>

          {/* Payment Form */}
          {loading ? (
            <div className="loading">Initializing payment system...</div>
          ) : error ? (
            <div className="error-message">
              <p>❌ {error}</p>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Card Details</label>
                <div id="sq-card-container"></div>
              </div>

              <button
                type="submit"
                disabled={processing || loading}
                className="btn-pay"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '20px',
                  backgroundColor: '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Processing...' : `Pay ${course.currency || 'USD'} ${course.price.toFixed(2)}`}
              </button>

              <p className="payment-note" style={{ fontSize: '12px', marginTop: '12px', textAlign: 'center', color: '#666' }}>
                Your payment is secure and encrypted. You will have immediate access to the course after payment.
              </p>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentModal;