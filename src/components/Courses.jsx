import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import AuthForms from './AuthForms';

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

  function loadCourses() {
    setLoading(true);
    api.getCourses()
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (user) loadCourses();
  }, [user]);

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
      const result = await api.initiatePayment(courseId);
      if (result.status === 'success' && result.payment_link) {
        window.location.href = result.payment_link;
      } else {
        // Covers both "unavailable" (no Flutterwave key set yet) and "error"
        setPayNote(result.message);
      }
    } catch (e) {
      setPayNote(e.message);
    } finally {
      setBusyId(null);
    }
  }

  function renderAction(course) {
    if (course.access_status === 'trial') {
      return <span className="trial-badge">Free trial until {formatTrialEnd(course.trial_ends_at)}</span>;
    }
    if (course.access_status === 'active') {
      return <span className="enrolled-badge">Active ✓</span>;
    }
    if (course.access_status === 'expired') {
      return (
        <button className="btn btn-primary" onClick={() => handleUpgrade(course.id)} disabled={busyId === course.id}>
          {busyId === course.id ? 'Please wait...' : `Pay ${formatPrice(course.price, course.currency)}/mo to continue`}
        </button>
      );
    }
    return (
      <button className="btn btn-primary" onClick={() => handleEnroll(course.id)} disabled={busyId === course.id}>
        {busyId === course.id ? 'Enrolling...' : 'Start free trial'}
      </button>
    );
  }

  return (
    <section className="courses" id="courses">
      <div className="container">
        <h2 className="section-title">Online Courses</h2>
        <p className="section-subtitle">1 month free, then a simple monthly rate to continue</p>

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
          <p className="error-text">{error}</p>
        ) : (
          <>
            {payNote && <div className="alert alert-error payment-note">{payNote}</div>}
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-icon">{course.icon}</div>
                  <h3>{course.title}</h3>
                  <p className="course-level">{course.level} &middot; {course.duration}</p>
                  <p>{course.description}</p>
                  <p className="course-price">{formatPrice(course.price, course.currency)}/month after trial</p>
                  {renderAction(course)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
