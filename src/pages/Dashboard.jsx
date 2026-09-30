import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'services'

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch enrollments
      const enrollmentsData = await api.getMyEnrollments();
      const enrollmentList = enrollmentsData.enrollments || [];
      setEnrollments(enrollmentList);

      // Fetch all courses
      let coursesData = await api.getCourses();
      if (coursesData && typeof coursesData === 'object' && !Array.isArray(coursesData)) {
        coursesData = coursesData.courses || coursesData.data || [];
      }

      // Filter enrolled courses
      const enrolledIds = new Set(enrollmentList.map(e => e.course_id));
      const enrolled = (coursesData || []).filter(course => enrolledIds.has(course.id));
      setEnrolledCourses(enrolled);

      console.log('[Dashboard] Loaded:', enrolled.length, 'enrolled courses');
    } catch (err) {
      console.error('[Dashboard] Error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>🔄 Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: 'bold' }}>
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          Track your learning progress and manage your courses
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px 0',
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => setActiveTab('enrolled')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'enrolled' ? '#1e40af' : 'transparent',
            color: activeTab === 'enrolled' ? 'white' : '#666',
            border: 'none',
            borderBottom: activeTab === 'enrolled' ? '3px solid #1e40af' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'enrolled' ? 'bold' : 'normal',
            borderRadius: '4px 4px 0 0'
          }}
        >
          📚 My Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'services' ? '#1e40af' : 'transparent',
            color: activeTab === 'services' ? 'white' : '#666',
            border: 'none',
            borderBottom: activeTab === 'services' ? '3px solid #1e40af' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'services' ? 'bold' : 'normal',
            borderRadius: '4px 4px 0 0'
          }}
        >
          🎯 My Services
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {error && (
          <div style={{
            padding: '20px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            color: '#991b1b',
            marginBottom: '30px',
            border: '1px solid #fca5a5'
          }}>
            ❌ Error: {error}
          </div>
        )}

        {/* Enrolled Courses Tab */}
        {activeTab === 'enrolled' && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                  You haven't enrolled in any courses yet.
                </p>
                <button
                  onClick={() => navigate('/courses')}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Explore Courses →
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '25px'
              }}>
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      border: '2px solid #d1d5db'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    {course.icon && (
                      <img
                        src={course.icon}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    )}

                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '20px' }}>✅</span>
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>
                          ENROLLED
                        </span>
                      </div>

                      <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '18px',
                        color: '#1e40af',
                        fontWeight: 'bold'
                      }}>
                        {course.title}
                      </h3>

                      {course.description && (
                        <p style={{
                          fontSize: '14px',
                          color: '#666',
                          marginBottom: '15px',
                          lineHeight: '1.5'
                        }}>
                          {course.description}
                        </p>
                      )}

                      <div style={{
                        fontSize: '12px',
                        color: '#999',
                        marginBottom: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                      }}>
                        {course.instructor && <div>👨‍🏫 {course.instructor}</div>}
                        {course.duration && <div>⏱️ {course.duration}</div>}
                        {course.level && <div>📊 {course.level}</div>}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: '#1e40af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        Continue Learning →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              Service subscriptions will appear here.
            </p>
            <button
              onClick={() => navigate('/services')}
              style={{
                padding: '12px 30px',
                backgroundColor: '#1e40af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Browse Services →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;