import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';  // ✅ NAMED import

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCourses: 0, userEnrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await api.getCourses();
        let enrollmentCount = 0;
        
        if (user) {
          const enrollments = await api.getMyEnrollments();
          enrollmentCount = enrollments.enrollments.length;
        }

        setStats({
          totalCourses: courses.length,
          userEnrollments: enrollmentCount
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
          🚀 Welcome to Ayinde Technologies
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
          Master cutting-edge skills with expert instructors
        </p>

        {!user ? (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '14px 32px', fontSize: '16px', backgroundColor: 'white',
              color: '#1e40af', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
            }}>Login</button>
            <button onClick={() => navigate('/register')} style={{
              padding: '14px 32px', fontSize: '16px', backgroundColor: '#fbbf24',
              color: '#1e40af', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
            }}>Start Learning</button>
          </div>
        ) : (
          <button onClick={() => navigate('/courses')} style={{
            padding: '14px 32px', fontSize: '16px', backgroundColor: '#fbbf24',
            color: '#1e40af', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>Browse Courses</button>
        )}
      </div>

      {!loading && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px', maxWidth: '1200px', margin: '40px auto', padding: '0 20px'
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>
              {stats.totalCourses}
            </div>
            <div style={{ color: '#666', marginTop: '10px' }}>Courses Available</div>
          </div>

          {user && (
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                {stats.userEnrollments}
              </div>
              <div style={{ color: '#666', marginTop: '10px' }}>Your Enrollments</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;