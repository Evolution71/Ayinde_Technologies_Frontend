import React, { useState, useEffect } from 'react';
import { api } from '../api';

const SquarePaymentModal = ({ course, user, onClose, onSuccess }) => {
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

        // Create payment intent - FIXED: Use correct API function name
        const response = await api.initiatePayment(course.id);
        
        if (response.status === 'success') {
          setClientToken(response.client_token);
          setPaymentId(response.payment_id);
        } else {
          setError(response.message || 'Failed to create payment intent');
        }
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [course.id]);

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
      const card = window.squareCard;

      // Request card nonce
      const result = await card.requestCardNonce();

      if (result.status === 'OK') {
        const nonce = result.details.cardNonce;

        // Complete payment
        const paymentResult = await api.verifyPayment(
          paymentId,
          nonce
        );

        if (paymentResult.status === 'success') {
          onSuccess();
          onClose();
        } else {
          setError(paymentResult.message || 'Payment failed. Please try again.');
        }
      } else {
        setError('Failed to process card. Please check your information.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again or contact support.');
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
            <div className="summary-item">
              <span>Price:</span>
              <span className="summary-value">${course.price}</span>
            </div>
            <div className="summary-item">
              <span>Instructor:</span>
              <span className="summary-value">{course.instructor || 'Expert Instructor'}</span>
            </div>
          </div>

          {/* Payment Form */}
          {loading ? (
            <div className="loading">Initializing payment...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Card Details</label>
                <div id="sq-card-container"></div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={processing || loading}
                className="btn-pay"
              >
                {processing ? 'Processing...' : `Pay $${course.price}`}
              </button>

              <p className="payment-note">
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