import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import SquarePaymentModal from './SquarePaymentModal';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollments, setEnrollments] = useState({});

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.getCourses();
        setCourses(response || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handlePayNow = (course) => {
    if (!user) {
      alert('Please log in to purchase this course');
      return;
    }
    setActiveCourse(course);
    setShowPaymentModal(true);
  };

  const handleEnroll = (course) => {
    if (!user) {
      alert('Please log in to enroll');
      return;
    }
    enrollForTrial(course.id);
  };

  const enrollForTrial = async (courseId) => {
    try {
      await api.enrollInCourse(courseId);
      setEnrollments(prev => ({
        ...prev,
        [courseId]: { status: 'trial' }
      }));
      alert('Enrolled in trial! You have 30 days of free access.');
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll in course');
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    if (activeCourse) {
      setEnrollments(prev => ({
        ...prev,
        [activeCourse.id]: { status: 'active' }
      }));
      alert('Payment successful! You now have full access to the course.');
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-container">
      <h1>Our Courses</h1>
      <p>Learn from our expert instructors and advance your skills</p>

      <div className="courses-grid">
        {courses.map(course => {
          const enrollment = enrollments[course.id];
          const isEnrolled = enrollment?.status === 'trial' || enrollment?.status === 'active';
          const hasPaid = enrollment?.status === 'active';

          return (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <img src={course.icon} alt={course.title} className="course-icon" />
                <h3>{course.title}</h3>
              </div>

              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <span className="level">{course.level}</span>
                <span className="duration">{course.duration}</span>
              </div>

              <div className="course-footer">
                <span className="price">${course.price}</span>

                {!isEnrolled ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEnroll(course)}
                    >
                      Start Free Trial
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handlePayNow(course)}
                    >
                      Buy Now
                    </button>
                  </>
                ) : hasPaid ? (
                  <button className="btn btn-success" disabled>
                    ✓ Enrolled
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => handlePayNow(course)}
                  >
                    Upgrade to Full Access
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showPaymentModal && activeCourse && (
        <SquarePaymentModal
          course={activeCourse}
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Courses;