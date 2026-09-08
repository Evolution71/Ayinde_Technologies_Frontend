import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import AuthForms from './AuthForms';

export default function Courses() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);

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
    setEnrollingId(courseId);
    try {
      await api.enrollInCourse(courseId);
      loadCourses();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <section className="courses" id="courses">
      <div className="container">
        <h2 className="section-title">Online Courses</h2>
        <p className="section-subtitle">Tutoring and self-paced tracks in tech skills</p>

        {authLoading ? (
          <p className="loading">Checking login status...</p>
        ) : !user ? (
          <div className="gated-content">
            <p className="gated-message">Log in to see our course catalog and enroll.</p>
            <AuthForms />
          </div>
        ) : loading ? (
          <p className="loading">Loading courses...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p className="course-level">{course.level} &middot; {course.duration}</p>
                <p>{course.description}</p>
                {course.enrolled ? (
                  <span className="enrolled-badge">Enrolled ✓</span>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingId === course.id}
                  >
                    {enrollingId === course.id ? 'Enrolling...' : 'Enroll'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
