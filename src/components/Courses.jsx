import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        const coursesData = await api.getCourses();
        setCourses(coursesData);

        if (user && user.id) {
          try {
            const projects = await api.getProjects();
            const enrolledIds = new Set(
              projects.filter(p => p.course_id).map(p => p.course_id)
            );
            setEnrolledCourseIds(enrolledIds);
            console.log('[Courses] Enrolled:', Array.from(enrolledIds));
          } catch (err) {
            console.warn('[Courses] Enrollments unavailable:', err);
          }
        }
      } catch (err) {
        console.error('[Courses] Error:', err);
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [user]);

  const handleEnroll = (courseId) => {
    if (!user) {
      alert('Please login to enroll');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${courseId}`);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Our Courses</h2>
      <p>Master in-demand skills with our expert-led courses</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.id);
            return (
              <div key={course.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
                {course.icon && <img src={course.icon} alt={course.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} />}
                
                <h3 style={{ margin: '0 0 10px 0' }}>{course.title}</h3>
                
                {course.description && <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{course.description}</p>}
                
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>
                  {course.instructor && <div>👨‍🏫 {course.instructor}</div>}
                  {course.duration && <div>⏱️ {course.duration}</div>}
                  {course.level && <div>📊 {course.level}</div>}
                </div>
                
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1e40af' }}>
                  {course.currency || 'USD'} {course.price?.toFixed(2) || '0.00'}
                </div>
                
                <button
                  onClick={() => !isEnrolled && handleEnroll(course.id)}
                  disabled={isEnrolled}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isEnrolled ? 'default' : 'pointer',
                    backgroundColor: isEnrolled ? '#4ade80' : '#1e40af',
                    color: 'white'
                  }}
                >
                  {isEnrolled ? '✅ Enrolled' : 'Enroll Now'}
                </button>
              </div>
            );
          })
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Courses;