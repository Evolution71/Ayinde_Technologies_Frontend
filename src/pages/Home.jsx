import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCourses: 0, userEnrollments: 0 });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  // Scroll to hash on mount or when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Always fetch public courses (no auth needed)
        let coursesData = await api.getCourses();
        
        // Handle different response formats
        if (coursesData && typeof coursesData === 'object' && !Array.isArray(coursesData)) {
          // If it's an object with a courses property, extract it
          coursesData = coursesData.courses || coursesData.data || [];
        }
        
        coursesData = coursesData || [];
        setCourses(coursesData);

        // ✅ Fetch services (public endpoint)
        try {
          let servicesData = await api.getServices();
          if (servicesData && typeof servicesData === 'object' && !Array.isArray(servicesData)) {
            servicesData = servicesData.services || servicesData.data || [];
          }
          servicesData = servicesData || [];
          setServices(servicesData);
        } catch (err) {
          console.error('Error fetching services:', err);
          setServices([]);
        }
        let enrollmentCount = 0;
        
        // ✅ Only fetch enrollments if user is logged in
        if (user) {
          try {
            const enrollments = await api.getMyEnrollments();
            enrollmentCount = enrollments.enrollments?.length || 0;
          } catch (err) {
            // Silently fail - user may not have enrollments
            enrollmentCount = 0;
          }
        }

        setStats({
          totalCourses: Array.isArray(coursesData) ? coursesData.length : 0,
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

  // ✅ Handle Enroll button click
  const handleEnrollClick = async (courseId, courseName) => {
    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If logged in, start trial enrollment
    try {
      setEnrollingCourseId(courseId);
      await api.enrollInCourse(courseId);
      
      alert(`✅ You've successfully enrolled in ${courseName}! 30-day trial starts now.`);
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Error enrolling in course. Please try again.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* ========== HERO SECTION ========== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          padding: '80px 40px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
          🚀 Welcome to Ayinde Technologies
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
          Master cutting-edge skills with expert instructors
        </p>

        {!user ? (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#1e40af',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                backgroundColor: '#fbbf24',
                color: '#1e40af',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Start Learning
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/courses')}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#fbbf24',
              color: '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Browse Courses
          </button>
        )}
      </div>

      {/* ========== STATS SECTION ========== */}
      {!loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '0 20px'
          }}
        >
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

      {/* ========== SERVICES SECTION ========== */}
      <div id="services" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Our Services
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}
        >
          {(services && services.length > 0 ? services : [
            { 
              icon: '💻', 
              title: 'AI App Development', 
              desc: 'Build intelligent applications with cutting-edge AI technologies' 
            },
            { 
              icon: '🌐', 
              title: 'Web Development', 
              desc: 'Full-stack web solutions from concept to deployment' 
            },
            { 
              icon: '🤝', 
              title: 'Tech Consulting', 
              desc: 'Strategic guidance for your digital transformation' 
            },
            { 
              icon: '📚', 
              title: 'Training & Education', 
              desc: 'Expert-led courses to upskill your team' 
            }
          ]).map((service, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>{service.icon || '🚀'}</div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>{service.title || service.name}</h3>
              <p style={{ color: '#666' }}>{service.desc || service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== COURSES SECTION ========== */}
      <div id="courses" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Featured Courses
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px'
          }}
        >
          {courses.length > 0 ? (
            courses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
              <div style={{ backgroundColor: '#e0e7ff', padding: '20px', textAlign: 'center', height: '200px', overflow: 'hidden' }}>
                {course.icon ? (
                  <img 
                    src={course.icon} 
                    alt={course.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                ) : (
                  <div style={{ fontSize: '60px' }}>📚</div>
                )}
              </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                    {course.title}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px', minHeight: '40px' }}>
                    {course.description?.substring(0, 80)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>
                      ${course.price}
                    </div>
                    <button
                      onClick={() => handleEnrollClick(course.id, course.title)}
                      disabled={enrollingCourseId === course.id}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: enrollingCourseId === course.id ? '#999' : '#1e40af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: enrollingCourseId === course.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p>Loading courses...</p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => navigate('/courses')}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            View All Courses →
          </button>
        </div>
      </div>

      {/* ========== PROJECTS SECTION ========== */}
      <div id="projects" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Our Projects
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}
        >
          {[
            {
              title: 'AI-Powered Dashboard',
              description: 'Real-time analytics platform with machine learning predictions',
              tags: ['Python', 'React', 'TensorFlow']
            },
            {
              title: 'E-Learning Platform',
              description: 'Comprehensive online education system with subscription management',
              tags: ['FastAPI', 'React', 'PostgreSQL']
            },
            {
              title: 'Mobile Trading App',
              description: 'High-performance cryptocurrency trading application',
              tags: ['React Native', 'WebSocket', 'Python']
            },
            {
              title: 'Enterprise CRM',
              description: 'Customer relationship management system for businesses',
              tags: ['React', 'FastAPI', 'MongoDB']
            }
          ].map((project, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: 'bold' }}>
                {project.title}
              </h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>{project.description}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {project.tags.map((tag, j) => (
                  <span
                    key={j}
                    style={{
                      backgroundColor: '#e0e7ff',
                      color: '#1e40af',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== TEAM SECTION ========== */}
      <div id="team" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', scrollMarginTop: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
          Our Team
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}
        >
          {[
            { name: 'Ayinde O.', role: 'Founder & CEO', expertise: 'AI Strategy' },
            { name: 'Tech Lead', role: 'Lead Developer', expertise: 'Full Stack' },
            { name: 'Data Lead', role: 'ML Engineer', expertise: 'Machine Learning' },
            { name: 'Design Lead', role: 'UI/UX Designer', expertise: 'Product Design' }
          ].map((member, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '50%',
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px'
                }}
              >
                👤
              </div>
              <h3 style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold' }}>
                {member.name}
              </h3>
              <p style={{ color: '#1e40af', marginBottom: '10px', fontWeight: '500' }}>
                {member.role}
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {member.expertise}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== CONTACT SECTION ========== */}
      <div id="contact" style={{ backgroundColor: '#1e40af', color: 'white', padding: '60px 40px', textAlign: 'center', marginTop: '60px', scrollMarginTop: '80px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '36px', fontWeight: 'bold' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9 }}>
          Contact us today to discuss your project or enroll in a course
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Enroll Now
          </button>
          <a
            href="mailto:support@ayindetechnologies.com"
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: '#fbbf24',
              color: '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Email Us
          </a>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: '14px' }}>
            📞 +1 949-520-8178 | 📧 support@ayindetechnologies.com
          </p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            112 S Market St, Suite 1008, Inglewood, CA 90301
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;