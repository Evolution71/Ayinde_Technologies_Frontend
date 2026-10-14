import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  { code: 'US', name: 'US' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'UK' },
];

const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px' };
const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  boxSizing: 'border-box',
};

// Accepts either a bare array or { [key]: [...] } from the API
const asArray = (data, key) => (Array.isArray(data) ? data : data?.[key] || []);

// Make sure the user is enrolled (trial) before a payment intent can be created
async function ensureEnrolled(courseId) {
  try {
    await api.getEnrollmentStatus(courseId);
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('403') || msg.includes('Not enrolled')) {
      try {
        await api.enrollInCourse(courseId);
      } catch (innerErr) {
        throw new Error(`Trial enrollment failed: ${innerErr.message}`);
      }
    }
    // Other errors are ignored here, as before; the payment intent call will surface real problems
  }
}

function CourseCheckoutForm({ course, paymentId }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingCountry, setBillingCountry] = useState('NG');

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    if (!cardComplete) {
      setError('Please enter your complete card details.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create a PaymentMethod from the card (card data goes straight to Stripe)
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          address: {
            postal_code: billingPostalCode,
            country: billingCountry,
          },
        },
      });

      if (pmError) {
        setError(pmError.message || 'Card error. Please check your details.');
        return;
      }

      // 2. Verify and charge on the backend
      const verifyResult = await api.verifyPayment(paymentId, paymentMethod.id);

      if (!verifyResult.success && verifyResult.status !== 'success') {
        setError(verifyResult.message || 'Payment failed. Please check your card and try again.');
        return;
      }

      alert('✅ Payment successful! You are now enrolled in the course.');
      navigate('/courses');
    } catch (err) {
      console.error('[Checkout] Payment error:', err);
      setError('Payment failed: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const submitDisabled = processing || !stripe || !cardComplete;

  return (
    <form onSubmit={handlePayment}>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Card</label>
        <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', minHeight: '50px' }}>
          <CardElement
            options={CARD_OPTIONS}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) setError(e.error.message);
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Postal Code</label>
        <input
          type="text"
          value={billingPostalCode}
          onChange={(e) => setBillingPostalCode(e.target.value)}
          placeholder="12345"
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Country</label>
        <select
          value={billingCountry}
          onChange={(e) => setBillingCountry(e.target.value)}
          style={inputStyle}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee2e2',
          borderRadius: '6px',
          marginBottom: '20px',
          color: '#991b1b',
          border: '1px solid #fca5a5',
        }}>
          ❌ {error}
        </div>
      )}

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
          cursor: submitDisabled ? 'default' : 'pointer',
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
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ← Back to Courses
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const numericId = parseInt(courseId, 10);

        // Look up the course the URL asks for
        let foundCourse = null;
        try {
          const allCourses = asArray(await api.getCourses(), 'courses');
          foundCourse = allCourses.find((c) => c.id === numericId) || null;
        } catch (err) {
          console.log('[Checkout] Could not fetch courses:', err);
        }

        // If it isn't in the public list, show the user's enrolled courses instead.
        // We do NOT auto-pick one, so the user can't be charged for a different course than the URL.
        if (!foundCourse) {
          try {
            const enrollmentIds = asArray(await api.getMyEnrollments(), 'enrollments').map((e) => e.course_id);
            const allCourses = asArray(await api.getCourses(), 'courses');
            const enrolled = allCourses.filter((c) => enrollmentIds.includes(c.id));
            if (!cancelled) setEnrolledCourses(enrolled);
            foundCourse = enrolled.find((c) => c.id === numericId) || null;
          } catch (err) {
            console.log('[Checkout] Could not get enrollments:', err);
          }
        }

        if (!foundCourse) {
          if (!cancelled) setError('Course not found. Choose one of your enrolled courses below.');
          return;
        }

        // Enroll first, then create the payment record (the backend requires enrollment)
        await ensureEnrolled(foundCourse.id);
        const payData = await api.createPaymentIntent(foundCourse.id, foundCourse.price);

        if (cancelled) return;
        setCourse(foundCourse);
        setPaymentId(payData.payment_id);
      } catch (err) {
        console.error('[Checkout] Init error:', err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [courseId, user, navigate]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '40px' }}>
        <h1>💳 Checkout</h1>

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#fee2e2',
            borderRadius: '6px',
            marginBottom: '20px',
            color: '#991b1b',
            border: '1px solid #fca5a5',
          }}>
            ❌ {error}
          </div>
        )}

        {!course && enrolledCourses.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3>Your Enrolled Courses:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {enrolledCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/checkout/${c.id}`)}
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{c.title}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>${c.price}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/courses')}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '15px',
                backgroundColor: '#e5e7eb',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ← Back to All Courses
            </button>
          </div>
        )}

        {course && paymentId && (
          <>
            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
              <h3>{course.title}</h3>
              <p>${course.price}</p>
            </div>

            <Elements stripe={stripePromise}>
              <CourseCheckoutForm course={course} paymentId={paymentId} />
            </Elements>
          </>
        )}
      </div>
    </div>
  );
}