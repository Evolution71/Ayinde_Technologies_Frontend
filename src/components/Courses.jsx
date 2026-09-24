import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';  // ✅ NAMED import (your original structure)

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch courses
        const coursesData = await api.getCourses();
        setCourses(coursesData);

        // Fetch enrollments
        const enrollmentsData = await api.getMyEnrollments();
        const enrolledIds = enrollmentsData.enrollments.map(e => e.course_id);
        setEnrolled(enrolledIds);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleEnroll = async (courseId) => {
    try {
      navigate(`/checkout/${courseId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading courses...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1>📚 Courses</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {courses.map(course => {
            const isEnrolled = enrolled.includes(course.id);
            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {course.icon && (
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                    {course.icon}
                  </div>
                )}

                <h3 style={{ margin: '0 0 10px 0' }}>{course.title}</h3>

                <p style={{
                  color: '#666',
                  fontSize: '14px',
                  marginBottom: '15px',
                  minHeight: '40px'
                }}>
                  {course.description}
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {course.level} • {course.duration}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    Instructor: {course.instructor}
                  </div>
                </div>

                <div style={{
                  padding: '15px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                    ${course.price}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    30-day free trial
                  </div>
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1e40af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🚀 Enroll Now
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;