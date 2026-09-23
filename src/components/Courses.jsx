import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles/courses.css';

const Courses = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all courses
        const coursesData = await api.getCourses();
        setCourses(coursesData);

        // Fetch user's projects (which includes enrollments)
        if (user && user.id) {
          try {
            const projects = await api.getProjects();
            
            // Extract enrolled course IDs from projects
            // Projects are essentially enrollments
            const enrolledIds = new Set(
              projects
                .filter(p => p.course_id)
                .map(p => p.course_id)
            );
            
            setEnrolledCourseIds(enrolledIds);
            console.log('[Courses] Enrolled courses:', Array.from(enrolledIds));
          } catch (err) {
            console.warn('[Courses] Could not fetch enrollments:', err);
            // Continue anyway - just won't show enrollment status
          }
        }
      } catch (err) {
        console.error('[Courses] Error fetching courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [user]);

  const handleEnroll = (courseId) => {
    if (!user) {
      alert('Please login to enroll in a course');
      navigate('/login');
      return;
    }

    // Navigate to checkout page
    navigate(`/checkout/${courseId}`);
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="courses-section">
      <div className="courses-header">
        <h2>Our Courses</h2>
        <p>Master in-demand skills with our expert-led courses</p>
      </div>

      <div className="courses-grid">
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.id);
            
            return (
              <div key={course.id} className="course-card">
                {course.icon && (
                  <div className="course-icon">
                    <img src={course.icon} alt={course.title} />
                  </div>
                )}

                <div className="course-content">
                  <h3>{course.title}</h3>
                  
                  {course.description && (
                    <p className="course-description">{course.description}</p>
                  )}

                  <div className="course-meta">
                    {course.instructor && (
                      <span className="instructor">👨‍🏫 {course.instructor}</span>
                    )}
                    {course.duration && (
                      <span className="duration">⏱️ {course.duration}</span>
                    )}
                    {course.level && (
                      <span className="level">📊 {course.level}</span>
                    )}
                  </div>

                  <div className="course-price">
                    <span className="amount">
                      {course.currency || 'USD'} {course.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  <button
                    className={`course-button ${isEnrolled ? 'enrolled' : 'enroll'}`}
                    onClick={() => !isEnrolled && handleEnroll(course.id)}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? '✅ Enrolled' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-courses">
            <p>No courses available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;