import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import AuthForms from './AuthForms';
import SquarePaymentModal from './SquarePaymentModal';

function formatPrice(price, currency) {
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(price);
  } catch (_) {
    return `${currency} ${price}`;
  }
}

function formatTrialEnd(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Courses() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [payNote, setPayNote] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null); // { clientToken, paymentId, amount, courseName }

  function loadCourses() {
    setLoading(true);
    setError('');
    api.getCourses()
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (user) loadCourses();
  }, [user]);

  // Keep the modal's data in sync after enroll/pay actions change course state.
  useEffect(() => {
    if (activeCourse) {
      const fresh = courses.find((c) => c.id === activeCourse.id);
      if (fresh) setActiveCourse(fresh);
    }
  }, [courses]);

  async function handleEnroll(courseId) {
    setBusyId(courseId);
    try {
      await api.enrollInCourse(courseId);
      loadCourses();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpgrade(courseId) {
    setBusyId(courseId);
    setPayNote('');
    try {
      // Step 1: Create payment intent and get client token
      const result = await api.createPaymentIntent(courseId);
      
      if (result.status === 'success' && result.client_token) {
        // Show Square payment modal
        setPaymentModal({
          clientToken: result.client_token,
          paymentId: result.payment_id,
          amount: result.amount, // in cents
          courseName: result.course_title,
        });
      } else if (result.status === 'trial_active') {
        setPayNote(result.message);
      } else if (result.status === 'already_enrolled') {
        setPayNote(result.message);
      } else {
        setPayNote(result.message || 'Failed to initiate payment');
      }
    } catch (e) {
      setPayNote(e.message);
    } finally {
      setBusyId(null);
    }
  }

  function handlePaymentSuccess() {
    // Payment verified by backend, refresh courses
    setPaymentModal(null);
    loadCourses();
  }

  function renderAction(course, size = '') {
    if (course.access_status === 'trial') {
      return <span className="trial-badge">Free trial until {formatTrialEnd(course.trial_ends_at)}</span>;
    }
    if (course.access_status === 'active') {
      return <span className="enrolled-badge">Active ✓</span>;
    }
    if (course.access_status === 'expired') {
      return (
        <button
          className={`btn btn-primary ${size}`}
          onClick={(e) => { e.stopPropagation(); handleUpgrade(course.id); }}
          disabled={busyId === course.id}
        >
          {busyId === course.id ? 'Please wait...' : `Renew access - ${formatPrice(course.price, course.currency)}/year`}
        </button>
      );
    }
    return (
      <button
        className={`btn btn-primary ${size}`}
        onClick={(e) => { e.stopPropagation(); handleEnroll(course.id); }}
        disabled={busyId === course.id}
      >
        {busyId === course.id ? 'Enrolling...' : 'Start free trial'}
      </button>
    );
  }

  return (
    <section className="courses" id="courses">
      <div className="container">
        <h2 className="section-title">Online Courses</h2>
        <p className="section-subtitle">Start free, then upgrade to continue learning</p>

        {authLoading ? (
          <p className="loading">Checking login status...</p>
        ) : !user ? (
          <div className="gated-content">
            <p className="gated-message">Log in to see our course catalog and start a free trial.</p>
            <AuthForms />
          </div>
        ) : loading ? (
          <p className="loading">Loading courses...</p>
        ) : error ? (
          <div className="error-block">
            <p className="error-text">{error}</p>
            <button className="btn btn-secondary" onClick={loadCourses}>Retry</button>
          </div>
        ) : (
          <>
            {payNote && <div className="alert alert-error payment-note">{payNote}</div>}
            <div className="courses-grid">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="course-card course-card-clickable"
                  onClick={() => setActiveCourse(course)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveCourse(course); }}
                >
                  <div className="course-icon">{course.icon}</div>
                  <h3>{course.title}</h3>
                  <p className="course-level">{course.level} &middot; {course.duration}</p>
                  <p className="course-desc-preview">{course.description}</p>
                  <p className="course-price">{formatPrice(course.price, course.currency)}/year after trial</p>
                  <span className="view-details-hint">View details &amp; enroll →</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeCourse && (
          <div className="modal-overlay" onClick={() => setActiveCourse(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setActiveCourse(null)} aria-label="Close">×</button>
              <div className="course-icon modal-course-icon">{activeCourse.icon}</div>
              <h3>{activeCourse.title}</h3>
              <p className="course-level">{activeCourse.level} &middot; {activeCourse.duration}</p>
              <p className="modal-description">{activeCourse.description}</p>
              <p className="course-price">{formatPrice(activeCourse.price, activeCourse.currency)}/year after a 30-day free trial</p>
              <div className="modal-action">{renderAction(activeCourse, 'btn-large')}</div>
            </div>
          </div>
        )}

        {paymentModal && (
          <SquarePaymentModal
            payment={paymentModal}
            onClose={() => setPaymentModal(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </section>
  );
}