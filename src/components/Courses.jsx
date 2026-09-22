import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = (courseId) => {
    if (!user) {
      alert('Please log in to enroll in a course');
      return;
    }
    // Navigate to checkout page
    navigate(`/checkout/${courseId}`);
  };

  if (loading) {
    return <div className="courses-container"><p>Loading courses...</p></div>;
  }

  return (
    <div className="courses-container" id="courses">
      <div className="section-header">
        <h2>Our Courses</h2>
        <p>Learn from industry experts at your own pace</p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            {course.icon && (
              <div className="course-icon">
                <img src={course.icon} alt={course.title} />
              </div>
            )}

            <div className="course-content">
              <h3>{course.title}</h3>
              
              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                {course.level && (
                  <span className="badge badge-level">{course.level}</span>
                )}
                {course.duration && (
                  <span className="badge badge-duration">⏱️ {course.duration}</span>
                )}
              </div>

              {course.instructor && (
                <p className="course-instructor">👨‍🏫 {course.instructor}</p>
              )}

              <div className="course-footer">
                <div className="price-section">
                  <span className="currency">{course.currency || 'USD'}</span>
                  <span className="price">{course.price.toFixed(2)}</span>
                </div>

                <button
                  className="btn-enroll"
                  onClick={() => handleEnroll(course.id)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;