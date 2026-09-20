import React, { useState, useEffect } from 'react';
import { api, getToken } from '../api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [activeCourse, setActiveCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (getToken()) {
          const userData = await api.me();
          setUser(userData);
        }
      } catch (err) {
        console.log('Not logged in');
      }
    };
    fetchUser();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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

  const handlePayNow = (course) => {
    if (!user) {
      alert('Please log in to make a payment');
      return;
    }
    setActiveCourse(course);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    if (activeCourse) {
      setEnrollments(prev => ({
        ...prev,
        [activeCourse.id]: { status: 'active' }
      }));
      alert('Payment successful! Welcome to the course!');
    }
  };

  if (loading) return <div className="courses-container"><p>Loading courses...</p></div>;
  if (error) return <div className="courses-container"><p>{error}</p></div>;

  return (
    <section className="courses-section">
      <div className="courses-container">
        <h2>Our Courses</h2>
        <p>Learn from our expert instructors and advance your skills</p>

        <div className="courses-grid">
          {courses.map(course => {
            const isEnrolled = enrollments[course.id];
            const hasPaid = isEnrolled?.status === 'active';

            return (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                </div>

                <div className="course-body">
                  <p className="course-description">{course.description}</p>
                  <p className="course-instructor">
                    <strong>Instructor:</strong> {course.instructor}
                  </p>

                  <div className="course-meta">
                    <span className="level">{course.level}</span>
                    <span className="duration">{course.duration_hours} hours</span>
                  </div>
                </div>

                <div className="course-footer">
                  <span className="price">${course.price}</span>

                  <div className="course-buttons">
                    {!isEnrolled ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEnroll(course)}
                          style={{ cursor: 'pointer' }}
                        >
                          Start Free Trial
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handlePayNow(course)}
                          style={{ cursor: 'pointer' }}
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
                        style={{ cursor: 'pointer' }}
                      >
                        Upgrade to Full Access
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPaymentModal && activeCourse && user && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Purchase: {activeCourse.title}</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Price: <strong>${activeCourse.price}</strong></p>
              <p>This is a placeholder for payment processing.</p>
              <button 
                className="btn btn-primary"
                onClick={handlePaymentSuccess}
                style={{ cursor: 'pointer' }}
              >
                Simulate Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .courses-section {
          padding: 60px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .courses-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .courses-section h2 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
          text-align: center;
        }

        .courses-section > div > p {
          text-align: center;
          color: #666;
          margin-bottom: 40px;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .course-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
        }

        .course-header h3 {
          margin: 0;
          font-size: 1.4rem;
        }

        .course-body {
          padding: 20px;
          flex-grow: 1;
        }

        .course-description {
          color: #555;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .course-instructor {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .course-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .level, .duration {
          display: inline-block;
          background: #f0f0f0;
          color: #333;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .course-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .price {
          font-size: 1.8rem;
          font-weight: bold;
          color: #667eea;
        }

        .course-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 18px;
          border: none;
          border-radius: 5px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #5568d3;
          transform: scale(1.05);
        }

        .btn-secondary {
          background: #f093fb;
          color: white;
        }

        .btn-secondary:hover {
          background: #e07ce0;
          transform: scale(1.05);
        }

        .btn-success {
          background: #4caf50;
          color: white;
          opacity: 0.7;
          cursor: default;
        }

        .btn-warning {
          background: #ff9800;
          color: white;
        }

        .btn-warning:hover {
          background: #e68900;
          transform: scale(1.05);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-body {
          padding: 30px;
          text-align: center;
        }

        .modal-body p {
          margin: 15px 0;
          color: #666;
        }
      `}</style>
    </section>
  );
};

export default Courses;