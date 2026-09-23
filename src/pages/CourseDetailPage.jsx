import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import TrialWarningModal from '../components/TrialWarningModal';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(null);
  const [showPaymentWall, setShowPaymentWall] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowPaymentWall(false);

        if (!user) {
          navigate('/login');
          return;
        }

        // Try to get course details
        try {
          const courseData = await api.getCourseDetail(courseId);
          console.log('[CourseDetail] Course:', courseData);
          
          setCourse(courseData);
          setLessons(courseData.lessons || []);
          
          if (courseData.lessons && courseData.lessons.length > 0) {
            setSelectedLesson(courseData.lessons[0]);
          }

          // Get progress
          const progressData = await api.getCourseProgress(courseId);
          setProgress(progressData);
          console.log('[CourseDetail] Progress:', progressData);

          // Calculate trial days remaining
          if (courseData.trial_ends_at) {
            const now = new Date();
            const trialEnds = new Date(courseData.trial_ends_at);
            const daysLeft = Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24));
            setTrialDaysRemaining(daysLeft);
            console.log('[CourseDetail] Trial days remaining:', daysLeft);
          }
        } catch (err) {
          console.error('[CourseDetail] Error fetching course:', err);
          
          // CHECK IF 403 (TRIAL EXPIRED)
          if (err.message && err.message.includes('403')) {
            console.log('[CourseDetail] Trial expired - showing payment wall');
            
            // Try to get enrollments to show which course expired
            try {
              const enrollmentsData = await api.getMyEnrollments();
              const enrollment = enrollmentsData.enrollments?.find(e => e.course_id === courseId);
              
              if (enrollment) {
                console.log('[CourseDetail] Enrollment found:', enrollment);
                // Try to fetch course basic info
                const coursesData = await api.getCourses();
                const courseInfo = coursesData.find(c => c.id === courseId);
                
                if (courseInfo) {
                  setCourse(courseInfo);
                  setTrialDaysRemaining(0);  // Trial expired
                  setShowPaymentWall(true);
                  return;
                }
              }
            } catch (innerErr) {
              console.warn('[CourseDetail] Could not get enrollment info:', innerErr);
            }
            
            // Fallback: show generic payment wall
            setError('Trial expired. Please subscribe to continue.');
            setShowPaymentWall(true);
            setTrialDaysRemaining(0);
            return;
          }
          
          // OTHER ERROR
          setError(err.message || 'Failed to load course');
          if (err.message && (err.message.includes('403') || err.message.includes('Forbidden'))) {
            setTimeout(() => navigate('/courses'), 2000);
          }
        }
      } catch (err) {
        console.error('[CourseDetail] Unexpected error:', err);
        setError('Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user, navigate]);

  const handleLessonComplete = async () => {
    if (!selectedLesson) return;
    
    try {
      await api.completeLesson(courseId, selectedLesson.id);
      alert('✅ Lesson marked as complete!');
      
      // Refresh progress
      const progressData = await api.getCourseProgress(courseId);
      setProgress(progressData);
      
      // Move to next lesson
      const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
      if (currentIndex < lessons.length - 1) {
        setSelectedLesson(lessons[currentIndex + 1]);
      }
    } catch (err) {
      console.error('[CourseDetail] Error completing lesson:', err);
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading course...</div>;
  }

  // SHOW PAYMENT WALL IF TRIAL EXPIRED
  if (showPaymentWall && course) {
    return (
      <TrialWarningModal
        course={course}
        daysRemaining={0}  // Trial expired
        onUpgrade={() => navigate(`/checkout/${courseId}`)}
        onContinue={() => {}}
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <h3>Error: {error}</h3>
        <p>Redirecting to courses...</p>
      </div>
    );
  }

  if (!course) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Course not found</div>;
  }

  const progressPercentage = progress?.overall_progress || 0;
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => 
    progress?.lessons?.some(pl => pl.lesson_id === l.id && pl.completed)
  ).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Trial Warning Banner */}
        {course && trialDaysRemaining !== null && trialDaysRemaining > 0 && trialDaysRemaining <= 3 && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#d97706' }}>
                ⚠️ Trial ending in {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                Subscribe now to keep your progress and continue learning
              </p>
            </div>
            <button
              onClick={() => navigate(`/checkout/${courseId}`)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginLeft: '20px'
              }}
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/courses')}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            backgroundColor: '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Courses
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Left: Lessons List */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ marginTop: 0 }}>📚 Lessons ({completedLessons}/{totalLessons})</h3>
            
            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                height: '8px'
              }}>
                <div style={{
                  backgroundColor: '#4ade80',
                  height: '100%',
                  width: `${progressPercentage}%`,
                  transition: 'width 0.3s'
                }} />
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {progressPercentage.toFixed(0)}% Complete
              </p>
            </div>

            {/* Lessons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lessons.map((lesson) => {
                const isCompleted = progress?.lessons?.some(
                  pl => pl.lesson_id === lesson.id && pl.completed
                );
                const isSelected = selectedLesson?.id === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: isSelected ? '2px solid #1e40af' : '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {isCompleted ? '✅' : `${lesson.order}`}
                      </span>
                      <div>
                        <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                          {lesson.title}
                        </div>
                        {lesson.duration_minutes && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            ⏱️ {lesson.duration_minutes} min
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Lesson Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {selectedLesson ? (
              <>
                <h2 style={{ marginTop: 0, marginBottom: '10px' }}>
                  {selectedLesson.title}
                </h2>
                
                {selectedLesson.duration_minutes && (
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    ⏱️ {selectedLesson.duration_minutes} minutes
                  </p>
                )}

                {/* Video Placeholder */}
                {selectedLesson.video_url ? (
                  <div style={{
                    width: '100%',
                    paddingBottom: '56.25%',
                    position: 'relative',
                    marginBottom: '30px',
                    backgroundColor: '#000',
                    borderRadius: '8px'
                  }}>
                    <iframe
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                      src={selectedLesson.video_url}
                      title={selectedLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '30px',
                    color: '#999'
                  }}>
                    Video coming soon
                  </div>
                )}

                {/* Description */}
                {selectedLesson.description && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4>📖 About this lesson</h4>
                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                      {selectedLesson.description}
                    </p>
                  </div>
                )}

                {/* Content HTML */}
                {selectedLesson.content_html && (
                  <div style={{
                    marginBottom: '30px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '6px',
                    border: '1px solid #eee'
                  }}>
                    <h4>📝 Lesson Content</h4>
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedLesson.content_html }}
                      style={{ lineHeight: '1.8', color: '#333' }}
                    />
                  </div>
                )}

                {/* Resources */}
                {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4>📎 Resources</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {selectedLesson.resources.map((resource, idx) => (
                        <li key={idx} style={{ marginBottom: '10px' }}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#1e40af',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            📥 {resource.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complete Button */}
                <button
                  onClick={handleLessonComplete}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#4ade80',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  ✓ Mark as Complete
                </button>
              </>
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>Select a lesson to start learning</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;