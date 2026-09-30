import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [expiredCourses, setExpiredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'expired'

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

      // Fetch all courses
      let coursesData = await api.getCourses();
      if (coursesData && typeof coursesData === 'object' && !Array.isArray(coursesData)) {
        coursesData = coursesData.courses || coursesData.data || [];
      }

      // Separate and TRACK EVERYTHING: active and expired courses
      const active = [];
      const expired = [];

      enrollmentList.forEach(enrollment => {
        const course = (coursesData || []).find(c => c.id === enrollment.course_id);
        if (course) {
          const now = new Date();
          const trialEndsAt = new Date(enrollment.trial_ends_at);

          if (trialEndsAt > now) {
            // ACTIVE: Trial still valid
            active.push({
              ...course,
              enrollment: enrollment,
              daysRemaining: Math.ceil((trialEndsAt - now) / (1000 * 60 * 60 * 24))
            });
          } else {
            // EXPIRED: Trial has ended - TRACK IT
            expired.push({
              ...course,
              enrollment: enrollment,
              expiredDate: trialEndsAt,
              daysExpired: Math.ceil((now - trialEndsAt) / (1000 * 60 * 60 * 24))
            });
          }
        }
      });

      // TRACK EVERYTHING: Store both active and expired
      setEnrolledCourses(active);
      setExpiredCourses(expired);

      console.log('[Dashboard] Active:', active.length, 'Expired:', expired.length, 'Total Tracked:', active.length + expired.length);
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

      {/* Tab Navigation - TRACK EVERYTHING */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px 0',
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'active' ? '#1e40af' : 'transparent',
            color: activeTab === 'active' ? 'white' : '#666',
            border: 'none',
            borderBottom: activeTab === 'active' ? '3px solid #1e40af' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'active' ? 'bold' : 'normal',
            borderRadius: '4px 4px 0 0'
          }}
        >
          📚 Active Courses ({enrolledCourses.length})
        </button>
        {expiredCourses.length > 0 && (
          <button
            onClick={() => setActiveTab('expired')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'expired' ? '#1e40af' : 'transparent',
              color: activeTab === 'expired' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'expired' ? '3px solid #1e40af' : 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === 'expired' ? 'bold' : 'normal',
              borderRadius: '4px 4px 0 0'
            }}
          >
            ⏱️ Expired ({expiredCourses.length})
          </button>
        )}
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

        {/* Active Courses Tab */}
        {activeTab === 'active' && (
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
                  You haven't enrolled in any active courses yet.
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
                      {/* Trial Days Remaining */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '6px',
                        border: '1px solid #93c5fd'
                      }}>
                        <span style={{ fontSize: '16px' }}>⏳</span>
                        <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>
                          {course.daysRemaining} days remaining
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '18px',
                        color: '#1e40af',
                        fontWeight: 'bold'
                      }}>
                        {course.title}
                      </h3>

                      {/* Course Description */}
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

                      {/* Course Details */}
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

                      {/* Price */}
                      {course.price && (
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#1e40af',
                          marginBottom: '15px'
                        }}>
                          {course.currency || 'USD'} {course.price.toFixed(2)}
                        </div>
                      )}

                      {/* Continue Learning Button */}
                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#1e40af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e3a8a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e40af';
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

        {/* Expired Courses Tab - TRACKING EVERYTHING */}
        {activeTab === 'expired' && (
          <div>
            {expiredCourses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '18px', color: '#666' }}>
                  No expired courses yet! Keep learning. 🎉
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '25px'
              }}>
                {expiredCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '2px solid #d1d5db',
                      opacity: 0.9
                    }}
                  >
                    {course.icon && (
                      <img
                        src={course.icon}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          filter: 'grayscale(50%)'
                        }}
                      />
                    )}

                    <div style={{ padding: '20px' }}>
                      {/* Trial Expired Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#fee2e2',
                        borderRadius: '6px',
                        border: '1px solid #fca5a5'
                      }}>
                        <span style={{ fontSize: '16px' }}>❌</span>
                        <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: 'bold' }}>
                          Trial Expired ({course.daysExpired} days ago)
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '18px',
                        color: '#1f2937',
                        fontWeight: 'bold'
                      }}>
                        {course.title}
                      </h3>

                      {/* Course Description */}
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

                      {/* Course Details */}
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

                      {/* Price */}
                      {course.price && (
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#1e40af',
                          marginBottom: '15px'
                        }}>
                          {course.currency || 'USD'} {course.price.toFixed(2)}
                        </div>
                      )}

                      {/* Upgrade to Premium Button */}
                      <button
                        onClick={() => navigate(`/checkout/${course.id}`)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#10b981';
                        }}
                      >
                        Upgrade to Premium →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;