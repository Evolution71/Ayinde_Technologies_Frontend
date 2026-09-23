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
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingCountry, setBillingCountry] = useState('US');
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const paymentsRef = useRef(null);
  const cardRef = useRef(null);
  const [cardReady, setCardReady] = useState(false);

  // Step 1: Initialize payment and load Square SDK
  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        // Try to get course
        let foundCourse = null;
        try {
          const courses = await api.getCourses();
          foundCourse = courses.find(c => c.id === parseInt(courseId));
        } catch (err) {
          console.log('[Checkout] Could not fetch all courses:', err);
        }

        // If not found, get enrolled courses
        if (!foundCourse) {
          try {
            const enrollmentsData = await api.getMyEnrollments();
            const enrollmentIds = enrollmentsData.enrollments.map(e => e.course_id);
            
            // Get all courses and filter by enrollment
            const allCourses = await api.getCourses();
            const enrolled = allCourses.filter(c => enrollmentIds.includes(c.id));
            setEnrolledCourses(enrolled);

            // Try to find course in enrollments
            if (parseInt(courseId) && enrolled.length > 0) {
              foundCourse = enrolled.find(c => c.id === parseInt(courseId));
            }

            // If still not found, use first enrolled course
            if (!foundCourse && enrolled.length > 0) {
              foundCourse = enrolled[0];
            }
          } catch (err) {
            console.log('[Checkout] Could not get enrollments:', err);
          }
        }

        if (!foundCourse) {
          setError('Course not found - showing your enrolled courses below');
          setLoading(false);
          return;
        }

        setCourse(foundCourse);

        // Initiate payment
        const payData = await api.initiatePayment(foundCourse.id, foundCourse.price, 'USD');
        setPaymentId(payData.payment_id);

        // Load Square SDK
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => {
          setLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    init();
  }, [courseId, user, navigate]);

  // Step 2: Initialize card when SDK ready
  useEffect(() => {
    if (!window.Square || !paymentId || cardReady) return;

    const initCard = async () => {
      try {
        const appId = process.env.REACT_APP_SQUARE_APP_ID?.trim();
        if (!appId) {
          setError('Square App ID not configured');
          return;
        }

        const payments = window.Square.payments(appId);
        paymentsRef.current = payments;

        const card = await payments.card();
        cardRef.current = card;

        await new Promise(resolve => setTimeout(resolve, 1000));
        await cardRef.current.attach('#sq-card-container');
        setCardReady(true);
      } catch (err) {
        setError('Card initialization failed: ' + err.message);
      }
    };

    initCard();
  }, [paymentId, cardReady]);

  // Step 3: Handle payment
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cardRef.current) {
      setError('Card not initialized');
      return;
    }

    try {
      setProcessing(true);

      // ✅ CORRECT: Use card.tokenize()
      const tokenResult = await cardRef.current.tokenize();

      if (tokenResult.status !== 'OK') {
        setError('Card error: ' + tokenResult.errors?.[0]?.message);
        setProcessing(false);
        return;
      }

      const token = tokenResult.token;

      // Verify payment
      await api.verifyPayment(paymentId, token, {
        billingPostalCode,
        billingCountry
      });

      alert('✅ Payment successful!');
      navigate('/courses');
    } catch (err) {
      setError('Payment failed: ' + err.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '40px' }}>
        <h1>💳 Checkout</h1>

        {error && (
          <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '6px', marginBottom: '20px', color: '#92400e' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Show enrolled courses if course not found */}
        {!course && enrolledCourses.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3>Your Enrolled Courses:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {enrolledCourses.map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/checkout/${c.id}`)}
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    textAlign: 'left'
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
                cursor: 'pointer'
              }}
            >
              ← Back to All Courses
            </button>
          </div>
        )}

        {course && (
          <>
            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
              <h3>{course.title}</h3>
              <p>${course.price}</p>
            </div>

            <form onSubmit={handlePayment}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Card</label>
                <div id="sq-card-container" style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', minHeight: '50px' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Postal Code</label>
                <input
                  type="text"
                  value={billingPostalCode}
                  onChange={(e) => setBillingPostalCode(e.target.value)}
                  placeholder="12345"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Country</label>
                <select
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="US">US</option>
                  <option value="NG">Nigeria</option>
                  <option value="CA">Canada</option>
                  <option value="GB">UK</option>
                </select>
              </div>

              <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>${course.price}</div>
              </div>

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