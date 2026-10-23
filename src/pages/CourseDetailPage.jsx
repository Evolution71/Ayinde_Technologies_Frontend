import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';  // ✅ FIXED: Named import
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';

// Card entry for saving a card on a trial course (Stripe Elements + SetupIntent)
const SaveCardForm = ({ courseId, onSaved, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!stripe || !elements) return;
    setSaving(true);
    setError('');
    try {
      // 1. Ask the backend for a SetupIntent tied to this user's Stripe customer
      const setup = await api.createSetupIntent(courseId);

      // 2. Confirm the card with Stripe. Card details go straight to Stripe.
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(setup.client_secret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      if (stripeError) {
        setError(stripeError.message || 'Card could not be saved');
        return;
      }
      if (!setupIntent || setupIntent.status !== 'succeeded') {
        setError('Card setup was not completed. Please try again.');
        return;
      }

      // 3. Store the saved card on the enrollment
      const saved = await api.savePaymentMethod(courseId, setupIntent.id);
      if (!saved.success) {
        setError(saved.message || 'Failed to save card');
        return;
      }
      await onSaved(saved);
    } catch (err) {
      setError(err.message || 'Payment error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div style={{
        border: '1px solid #ddd',
        padding: '14px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <CardElement onChange={(e) => setCardComplete(e.complete)} />
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#fee2e2',
          borderRadius: '6px',
          marginBottom: '15px',
          color: '#991b1b'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !stripe || !cardComplete}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: saving || !stripe || !cardComplete ? '#ccc' : '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: saving || !stripe || !cardComplete ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {saving ? 'Saving...' : '✅ Save Card'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: '12px 18px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Save card modal state
  const [showSaveCardModal, setShowSaveCardModal] = useState(false);

  // Load course and enrollment status
  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        // Get course
        const courseData = await api.getCourseDetail(courseId);
        setCourse(courseData);

        // Get enrollment status
        const statusData = await api.getEnrollmentStatus(courseId);
        setEnrollment(statusData);

        // Show save-card modal if trial and card not saved
        if (statusData.status === 'trial' && !statusData.card_saved && statusData.days_remaining > 0) {
          setShowSaveCardModal(true);
        }

        // Set default lesson
        if (courseData.lessons && courseData.lessons.length > 0) {
          setSelectedLesson(courseData.lessons[0]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    init();
  }, [courseId, user, navigate]);


  // Called by SaveCardForm after the card is saved
  const handleCardSaved = async (saveResult) => {
    alert('✅ ' + saveResult.message);
    setShowSaveCardModal(false);
    const updatedStatus = await api.getEnrollmentStatus(courseId);
    setEnrollment(updatedStatus);
  };

  // Handle complete lesson
  const handleCompleteLesson = async () => {
    try {
      await api.completeLesson(courseId, selectedLesson.id);
      alert('✅ Lesson marked complete!');
    } catch (err) {
      setError('Failed to complete lesson');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!course) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  const daysRemaining = enrollment?.days_remaining || 0;
  const isExpired = enrollment?.status === 'payment_failed' || daysRemaining <= 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      {error && (
        <div role="alert" style={{ padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}
      {/* Save Card Modal */}
      {showSaveCardModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>💳 Save Your Card</h2>
            <p>Your 30-day trial ends on <strong>{enrollment?.auto_charge_date}</strong></p>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Save your card now and we'll automatically continue your subscription. No charges today!
            </p>
            <Elements stripe={stripePromise}>
              <SaveCardForm
                courseId={courseId}
                onSaved={handleCardSaved}
                onCancel={() => setShowSaveCardModal(false)}
              />
            </Elements>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <button onClick={() => navigate('/courses')} style={{ marginBottom: '15px', cursor: 'pointer' }}>
            ← Back to Courses
          </button>
          <h1>{course.title}</h1>
        </div>

        {/* Trial Warning */}
        {enrollment?.status === 'trial' && daysRemaining > 0 && (
          <div style={{
            padding: '15px',
            backgroundColor: daysRemaining <= 3 ? '#fee2e2' : '#fef3c7',
            borderRadius: '8px',
            marginBottom: '20px',
            color: daysRemaining <= 3 ? '#991b1b' : '#92400e'
          }}>
            <strong>⏰ Trial ends in {daysRemaining} days</strong> - 
            {enrollment?.card_saved ? (
              <span> ✅ Card saved for auto-renewal</span>
            ) : (
              <button
                onClick={() => setShowSaveCardModal(true)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 15px',
                  backgroundColor: '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                💳 Save Card Now
              </button>
            )}
          </div>
        )}

        {isExpired && (
          <div style={{
            padding: '15px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#991b1b'
          }}>
            <strong>❌ Your trial has expired</strong>
            <button
              onClick={() => navigate(`/checkout/${courseId}`)}
              style={{
                marginLeft: '10px',
                padding: '8px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          {/* Left: Lessons */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            height: 'fit-content'
          }}>
            <h3>📚 Lessons</h3>
            {course.lessons?.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: selectedLesson?.id === lesson.id ? '#1e40af' : '#f3f4f6',
                  color: selectedLesson?.id === lesson.id ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>{idx + 1}. {lesson.title}</div>
              </button>
            ))}
          </div>

          {/* Right: Lesson Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px'
          }}>
            {selectedLesson ? (
              <>
                <h2>{selectedLesson.title}</h2>

                {selectedLesson.video_url && (
                  <iframe
                    title={selectedLesson.title}
                    width="100%"
                    height="400"
                    src={selectedLesson.video_url}
                    frameBorder="0"
                    allowFullScreen
                    style={{ marginBottom: '20px', borderRadius: '8px' }}
                  />
                )}

                <p>{selectedLesson.description}</p>

                <button
                  onClick={handleCompleteLesson}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '20px',
                    fontWeight: 'bold'
                  }}
                >
                  ✅ Mark as Complete
                </button>
              </>
            ) : (
              <p>Select a lesson to start learning</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;