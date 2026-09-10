import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

export default function PaymentComplete() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking'); // checking | success | error
  const [message, setMessage] = useState('Confirming your payment...');

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const flwStatus = searchParams.get('status');

    if (!transactionId) {
      setStatus('error');
      setMessage("We couldn't find a transaction to confirm. If you completed a payment, contact support@ayindetechnologies.com and we'll sort it out.");
      return;
    }

    if (flwStatus === 'cancelled') {
      setStatus('error');
      setMessage('Payment was cancelled. No charge was made — you can try again from the Courses section.');
      return;
    }

    api.verifyPayment(transactionId)
      .then((result) => {
        if (result.status === 'success') {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message || 'We could not confirm this payment.');
        }
      })
      .catch((e) => {
        setStatus('error');
        setMessage(e.message || 'We could not confirm this payment.');
      });
  }, [searchParams]);

  return (
    <section className="payment-complete">
      <div className="container">
        <div className={`payment-complete-card ${status}`}>
          {status === 'checking' && <div className="spinner" aria-hidden="true"></div>}
          <h1>
            {status === 'checking' && 'Confirming payment...'}
            {status === 'success' && 'Payment confirmed'}
            {status === 'error' && 'Payment not confirmed'}
          </h1>
          <p>{message}</p>
          <Link to="/#courses" className="btn btn-primary">Back to Courses</Link>
        </div>
      </div>
    </section>
  );
}
