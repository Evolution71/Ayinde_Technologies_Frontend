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
  const [billingCountry, setBillingCountry] = useState('NG');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentStep, setEnrollmentStep] = useState(null);

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
          const coursesResponse = await api.getCourses();
          // Handle both { courses: [...] } and [...] formats
          const courses = Array.isArray(coursesResponse)
            ? coursesResponse
            : (coursesResponse.courses || []);

          foundCourse = courses.find(c => c.id === parseInt(courseId));
        } catch (err) {
          console.log('[Checkout] Could not fetch all courses:', err);
        }

        // If not found, get enrolled courses
        if (!foundCourse) {
          try {
            const enrollmentsResponse = await api.getMyEnrollments();
            // Handle both { enrollments: [...] } and [...] formats
            const enrollmentsData = Array.isArray(enrollmentsResponse)
              ? enrollmentsResponse
              : (enrollmentsResponse.enrollments || []);

            const enrollmentIds = enrollmentsData.map(e => e.course_id);

            // Get all courses and filter by enrollment
            const coursesResponse = await api.getCourses();
            const allCourses = Array.isArray(coursesResponse)
              ? coursesResponse
              : (coursesResponse.courses || []);

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

        console.log('[Checkout] Creating payment intent for course:', foundCourse.id);
        const payData = await api.createPaymentIntent(foundCourse.id, foundCourse.price);
        console.log('[Checkout] Payment intent created:', payData);
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
        console.error('[Checkout] Init error:', err);
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

  // ✅ FIXED: Handle payment with proper enrollment flow
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cardRef.current) {
      setError('Card not initialized');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // STEP 1: Ensure user is enrolled in trial first
      console.log('[Checkout] Step 1: Checking trial enrollment...');
      setEnrollmentStep('Checking trial enrollment...');

      try {
        const enrollmentStatus = await api.getEnrollmentStatus(course.id);
        console.log('[Checkout] Existing enrollment:', enrollmentStatus);
      } catch (enrollErr) {
        // 403 means not enrolled - try to enroll
        if (enrollErr.message.includes('403') || enrollErr.message.includes('Not enrolled')) {
          console.log('[Checkout] Step 1a: Not enrolled, attempting trial enrollment...');
          setEnrollmentStep('Enrolling you in trial...');

          try {
            await api.enrollInCourse(course.id);
            console.log('[Checkout] ✅ Trial enrollment successful');
            setEnrollmentStep('Trial enrollment complete');
          } catch (innerErr) {
            console.error('[Checkout] Trial enrollment failed:', innerErr);
            setError(`Trial enrollment failed: ${innerErr.message}`);
            setProcessing(false);
            return;
          }
        }
      }

      // STEP 2: Tokenize card
      console.log('[Checkout] Step 2: Tokenizing card...');
      setEnrollmentStep('Processing card...');

      const tokenResult = await cardRef.current.tokenize();

      if (tokenResult.status !== 'OK') {
        setError('Card error: ' + tokenResult.errors?.[0]?.message);
        setProcessing(false);
        return;
      }

      const token = tokenResult.token;
      console.log('[Checkout] ✅ Token created');

      // STEP 3: Verify payment with backend
      console.log('[Checkout] Step 3: Verifying payment with backend...');
      setEnrollmentStep('Verifying payment...');

      // ✅ FIXED: Call verifyPayment with 3 parameters including billing info
      const verifyResult = await api.verifyPayment(paymentId, token, {
        billingPostalCode,
        billingCountry
      });

      console.log('[Checkout] Payment verification result:', verifyResult);

      // Check if payment actually succeeded
      if (!verifyResult.success && verifyResult.status !== 'success') {
        setError(verifyResult.message || 'Payment failed - please check your card and try again');
        setProcessing(false);
        return;
      }

      // Only navigate if TRULY successful
      console.log('[Checkout] ✅ Payment successful!');
      setEnrollmentStep('Payment successful!');
      alert('✅ Payment successful! You are now enrolled in the course.');
      navigate('/courses');
    } catch (err) {
      console.error('[Checkout] Payment error:', err);
      setError('Payment failed: ' + (err.message || 'Unknown error'));
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
          <div style={{ padding: '15px', backgroundColor: '#fee2e2', borderRadius: '6px', marginBottom: '20px', color: '#991b1b', border: '1px solid #fca5a5' }}>
            ❌ {error}
          </div>
        )}

        {enrollmentStep && (
          <div style={{ padding: '15px', backgroundColor: '#dbeafe', borderRadius: '6px', marginBottom: '20px', color: '#1e40af', border: '1px solid #93c5fd' }}>
            ℹ️ {enrollmentStep}
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
                  required
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