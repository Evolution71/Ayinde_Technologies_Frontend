import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api';

/**
 * SquarePaymentModal
 * 
 * Handles payment collection using Square Web Payments SDK.
 * 
 * Flow:
 * 1. Modal opens with client_token
 * 2. Square Web Payments SDK initializes
 * 3. User enters payment method in the form
 * 4. User clicks "Pay Now"
 * 5. SDK requests nonce
 * 6. We send nonce to backend for verification
 * 7. Backend charges and grants access
 * 8. Success or error message
 */
export default function SquarePaymentModal({ payment, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const paymentFormRef = useRef(null);

  useEffect(() => {
    // Load Square Web Payments SDK
    loadSquareSDK();
  }, []);

  async function loadSquareSDK() {
    // Check if already loaded
    if (window.Square) {
      initializePaymentForm();
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = initializePaymentForm;
    script.onerror = () => setError('Failed to load Square payment SDK');
    document.head.appendChild(script);
  }

  async function initializePaymentForm() {
    try {
      if (!window.Square) {
        setError('Square SDK not available');
        return;
      }

      const web = await window.Square.Web.Payments(
        process.env.REACT_APP_SQUARE_APP_ID
      );

      // Initialize payment form with client token
      const paymentForm = web.payments({ clientToken: payment.clientToken });

      // Create card payment method (you can add other methods here)
      const cardPaymentMethod = await paymentForm.card();
      await cardPaymentMethod.attach('#sq-card-container');

      paymentFormRef.current = { paymentForm, cardPaymentMethod };
    } catch (err) {
      console.error('Error initializing payment form:', err);
      setError(err.message || 'Failed to initialize payment form');
    }
  }

  async function handlePayment(e) {
    e.preventDefault();
    
    if (!paymentFormRef.current) {
      setError('Payment form not initialized');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { paymentForm } = paymentFormRef.current;

      // Request payment nonce from Square
      const result = await paymentForm.requestCardNonce();

      if (result.status === 'OK') {
        const nonce = result.details.id;
        const receiptUrl = result.details.receipt?.url || null;

        // Send to backend for verification
        const verifyResult = await api.verifyPayment(
          payment.paymentId,
          nonce,
          receiptUrl
        );

        if (verifyResult.status === 'success') {
          setSuccess(true);
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 2000);
        } else {
          setError(verifyResult.message || 'Payment verification failed');
        }
      } else {
        setError(result.errors?.[0]?.message || 'Failed to process payment');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  const amountDisplay = (payment.amount / 100).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card square-payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="payment-header">
          <h2>Complete Payment</h2>
          <p className="course-name">{payment.courseName}</p>
        </div>

        {success ? (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Your course access is now active. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="payment-form">
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}

            <div className="payment-amount">
              <span className="amount">${amountDisplay}</span>
              <span className="currency">USD</span>
            </div>

            {/* Square Card Payment Form */}
            <div className="payment-field-group">
              <label htmlFor="sq-card-container">Card Details</label>
              <div id="sq-card-container" className="sq-input"></div>
            </div>

            {/* Billing Info (Optional - you can add these if needed) */}
            <div className="payment-note">
              <p>🔒 Secure payment powered by Square</p>
              <p>Your card details are encrypted and never stored on our servers</p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing Payment...
                </>
              ) : (
                `Pay $${amountDisplay}`
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="payment-footer">
          <p>Questions? Email us at support@ayindetechnologies.com</p>
        </div>
      </div>
    </div>
  );
}