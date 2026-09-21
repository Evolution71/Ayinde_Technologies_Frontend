import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import SquarePaymentModal from './SquarePaymentModal';
import AuthForms from './AuthForms';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    api.getCourses()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching courses:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleBuyNow = (course) => {
    // Check if user is logged in
    if (!user) {
      // Show auth modal if not logged in
      setShowAuthModal(true);
      return;
    }

    // User is logged in - open payment modal
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <section className="courses" id="courses">
        <div className="container">
          <h2 className="section-title">Our Courses</h2>
          <p className="loading">Loading courses...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="courses" id="courses">
      <div className="container">
        <h2 className="section-title">Our Courses</h2>
        <p className="section-subtitle">Level up your skills with expert-led training</p>

        {error ? (
          <p className="error-text">Failed to load courses: {error}</p>
        ) : courses.length === 0 ? (
          <p className="no-courses">No courses available at the moment</p>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card" style={{ cursor: 'pointer' }}>
                {/* Course Icon/Image */}
                {course.icon && (
                  <div className="course-icon">
                    <img 
                      src={course.icon} 
                      alt={course.title}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                )}

                {/* Course Title */}
                <h3 className="course-title">{course.title}</h3>

                {/* Course Description */}
                <p className="course-description">{course.description}</p>

                {/* Course Meta */}
                <div className="course-meta">
                  <span className="course-level">{course.level}</span>
                  <span className="course-duration">{course.duration}</span>
                </div>

                {/* Course Details */}
                <div className="course-details">
                  {course.instructor && (
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                  )}
                  {course.trial_duration_days && (
                    <p><strong>Free Trial:</strong> {course.trial_duration_days} days</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="course-pricing">
                  <span className="price">
                    {course.currency} {course.price.toFixed(2)}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  className="btn btn-primary"
                  onClick={() => handleBuyNow(course)}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  {course.trial_duration_days ? 'Start Free Trial' : 'Enroll Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal - Show when not logged in */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={handleCloseAuthModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseAuthModal}>✕</button>
            <h2>Log in to Enroll</h2>
            <p>Please log in or create an account to enroll in this course.</p>
            <AuthForms onSuccess={handleCloseAuthModal} />
          </div>
        </div>
      )}

      {/* Payment Modal - Show when logged in and course selected */}
      {showPaymentModal && selectedCourse && (
        <SquarePaymentModal
          course={selectedCourse}
          onClose={handleClosePaymentModal}
        />
      )}
    </section>
  );
}