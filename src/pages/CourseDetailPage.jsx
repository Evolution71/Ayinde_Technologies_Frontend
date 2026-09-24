import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';  // ✅ FIXED: Named import

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
  const [cardReady, setCardReady] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const cardRef = useRef(null);
  const paymentsRef = useRef(null);

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

  // Initialize card form when modal opens
  useEffect(() => {
    if (!showSaveCardModal || cardReady) return;

    const initCard = async () => {
      try {
        // Wait for Square SDK to load
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = true;
          script.onload = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            initializeSquareCard();
          };
          document.head.appendChild(script);
        } else {
          initializeSquareCard();
        }
      } catch (err) {
        setError('Failed to initialize card form');
      }
    };

    const initializeSquareCard = async () => {
      try {
        const appId = process.env.REACT_APP_SQUARE_APP_ID?.trim();
        if (!appId) throw new Error('Square App ID not configured');

        const payments = window.Square.payments(appId);
        paymentsRef.current = payments;

        const card = await payments.card();
        cardRef.current = card;

        await card.attach('#sq-card-container-modal');
        setCardReady(true);
      } catch (err) {
        setError('Card initialization failed: ' + err.message);
      }
    };

    initCard();
  }, [showSaveCardModal, cardReady]);

  // Handle save card
  const handleSaveCard = async () => {
    if (!cardRef.current) {
      setError('Card not initialized');
      return;
    }

    try {
      setSavingCard(true);

      // ✅ Tokenize card
      const tokenResult = await cardRef.current.tokenize();

      if (tokenResult.status !== 'OK') {
        setError('Card error: ' + tokenResult.errors?.[0]?.message);
        setSavingCard(false);
        return;
      }

      const token = tokenResult.token;

      // Save to backend
      const saveResult = await api.savePaymentMethod(courseId, token);

      if (saveResult.success) {
        alert('✅ ' + saveResult.message);
        setShowSaveCardModal(false);
        
        // Refresh enrollment status
        const updatedStatus = await api.getEnrollmentStatus(courseId);
        setEnrollment(updatedStatus);
      } else {
        setError(saveResult.message || 'Failed to save card');
      }

      setSavingCard(false);
    } catch (err) {
      setError('Payment error: ' + err.message);
      setSavingCard(false);
    }
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

            <div id="sq-card-container-modal" style={{
              border: '1px solid #ddd',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              minHeight: '50px'
            }} />

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
                onClick={handleSaveCard}
                disabled={savingCard || !cardReady}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: savingCard || !cardReady ? '#ccc' : '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {savingCard ? 'Saving...' : '✅ Save Card'}
              </button>
              <button
                onClick={() => setShowSaveCardModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Skip for Now
              </button>
            </div>
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