import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSiteStyles from '../hooks/useSiteStyles';
import { api } from '../api';
import '../styles/site-base.css';
import '../styles/courses.css';
import NewsletterSection from '../components/NewsletterSection';

// Converted from 1018357a-courses.php (PHP). Markup and classes are unchanged.
const asArray = (data, key) => (Array.isArray(data) ? data : data?.[key] || []);

const Courses = () => {
  useSiteStyles();

  // Paid courses from the backend. Enroll uses the existing course page,
  // which handles the trial and checkout flow.
  const [paidCourses, setPaidCourses] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getCourses();
        if (!cancelled) setPaidCourses(asArray(data, 'courses'));
      } catch (err) {
        console.error('Could not load courses:', err);
      } finally {
        if (!cancelled) setCoursesLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div className="ayinde-site courses-page">
        <div>
          {/* Courses Page Specific CSS */}
          {/* === Page Header === */}
          <header className="courses-header">
            <div className="container position-relative z-3">
              <span className="badge-custom badge-blue bg-white bg-opacity-10 border border-light mb-4">
                <i className="fa-solid fa-play text-info me-2" /> FREE OPEN SOURCE LEARNING
              </span>
              <h1 className="display-font text-white mb-4" style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)'}}>Ayinde Tech Masterclasses</h1>
              <p className="lead text-white-50 mx-auto mb-5" style={{maxWidth: 650, fontSize: '1.1rem', lineHeight: '1.6'}}>
                World-class enterprise strategies, coding tutorials, and automation guides. 100% free and accessible directly on our YouTube channel.
              </p>
              <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="btn-youtube">
                <i className="fa-brands fa-youtube" style={{fontSize: 18}} /> Subscribe to our Channel
              </a>
            </div>
          </header>
          {/* === Paid Courses (from the backend) === */}
          {coursesLoaded && paidCourses.length > 0 && (
            <section className="py-5">
              <div className="container py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-2 border-bottom">
                  <h3 className="display-font mb-3 mb-md-0" style={{color: 'var(--color-navy)'}}>Enroll in Our Courses</h3>
                  <div className="text-muted small fw-bold"><i className="fa-solid fa-graduation-cap me-2" /> Structured, paid programs</div>
                </div>
                <div className="row g-4">
                  {paidCourses.map((course) => (
                    <div className="col-lg-4 col-md-6" key={course.id}>
                      <div className="course-card">
                        <div className="course-content">
                          <h4 className="display-font course-title">{course.title}</h4>
                          {course.description && <p className="course-desc">{course.description}</p>}
                          <div className="course-footer">
                            <span className="fw-bold" style={{color: 'var(--color-navy)'}}>
                              {course.currency || 'USD'} {Number(course.price || 0).toFixed(2)}
                            </span>
                            <Link to={`/courses/${course.id}`} className="watch-link">
                              Enroll now <i className="fa-solid fa-arrow-right ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          {/* === Courses Grid Section === */}
          <section className="py-5 bg-light">
            <div className="container py-4">
              {/* Section Filter/Title */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-2 border-bottom">
                <h3 className="display-font mb-3 mb-md-0" style={{color: 'var(--color-navy)'}}>Latest Uploads</h3>
                <div className="text-muted small fw-bold"><i className="fa-solid fa-video me-2" /> 24+ Free Modules Available</div>
              </div>
              <div className="row g-4">
                {/* Course 1 */}
                <div className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="course-thumbnail">
                      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Data Analytics" />
                      <div className="play-btn-overlay"><i className="fa-solid fa-play" /></div>
                      <div className="course-duration">45:20</div>
                    </a>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-badge">AI Integration</span>
                        <span className="text-muted small"><i className="fa-solid fa-calendar-days me-1" /> Oct 2026</span>
                      </div>
                      <h4 className="display-font course-title">Implementing AI Agents in Legacy Systems</h4>
                      <p className="course-desc">Learn the step-by-step framework we use to deploy predictive AI and automated customer service agents without breaking existing enterprise architecture.</p>
                      <div className="course-footer">
                        <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="watch-link">
                          <i className="fa-brands fa-youtube" style={{color: '#FF0000', fontSize: 18}} /> Watch on YouTube
                        </a>
                        <span className="text-muted small">1.2K Views</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Course 2 */}
                <div className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="course-thumbnail">
                      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" alt="Business Planning" />
                      <div className="play-btn-overlay"><i className="fa-solid fa-play" /></div>
                      <div className="course-duration">32:15</div>
                    </a>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-badge" style={{background: 'rgba(255,122,26,0.1)', color: 'var(--color-orange)'}}>Strategy</span>
                        <span className="text-muted small"><i className="fa-solid fa-calendar-days me-1" /> Sep 2026</span>
                      </div>
                      <h4 className="display-font course-title">Plan Before You Build: The Blueprint Phase</h4>
                      <p className="course-desc">CEO Albert A.D. Cabrera breaks down the exact documentation and scoping strategies required to prevent scope creep and budget overruns.</p>
                      <div className="course-footer">
                        <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="watch-link">
                          <i className="fa-brands fa-youtube" style={{color: '#FF0000', fontSize: 18}} /> Watch on YouTube
                        </a>
                        <span className="text-muted small">3.4K Views</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Course 3 */}
                <div className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="course-thumbnail">
                      <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" alt="Coding" />
                      <div className="play-btn-overlay"><i className="fa-solid fa-play" /></div>
                      <div className="course-duration">58:40</div>
                    </a>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-badge" style={{background: 'rgba(10,34,72,0.1)', color: 'var(--color-navy)'}}>Development</span>
                        <span className="text-muted small"><i className="fa-solid fa-calendar-days me-1" /> Sep 2026</span>
                      </div>
                      <h4 className="display-font course-title">Scaling Web Applications to 1M Users</h4>
                      <p className="course-desc">A deep dive into cloud architecture, load balancing, and database optimization techniques for enterprise-grade SaaS products.</p>
                      <div className="course-footer">
                        <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="watch-link">
                          <i className="fa-brands fa-youtube" style={{color: '#FF0000', fontSize: 18}} /> Watch on YouTube
                        </a>
                        <span className="text-muted small">5.1K Views</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Course 4 */}
                <div className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="course-thumbnail">
                      <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80" alt="Project Management" />
                      <div className="play-btn-overlay"><i className="fa-solid fa-play" /></div>
                      <div className="course-duration">22:10</div>
                    </a>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-badge" style={{background: 'rgba(255,122,26,0.1)', color: 'var(--color-orange)'}}>Management</span>
                        <span className="text-muted small"><i className="fa-solid fa-calendar-days me-1" /> Aug 2026</span>
                      </div>
                      <h4 className="display-font course-title">Agile Project Management for Startups</h4>
                      <p className="course-desc">Discover how to manage complex tech builds with hybrid agile methodologies, ensuring on-time delivery without burning out your team.</p>
                      <div className="course-footer">
                        <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="watch-link">
                          <i className="fa-brands fa-youtube" style={{color: '#FF0000', fontSize: 18}} /> Watch on YouTube
                        </a>
                        <span className="text-muted small">890 Views</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Course 5 */}
                <div className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="course-thumbnail">
                      <img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80" alt="Automation" />
                      <div className="play-btn-overlay"><i className="fa-solid fa-play" /></div>
                      <div className="course-duration">38:55</div>
                    </a>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-badge">Automation</span>
                        <span className="text-muted small"><i className="fa-solid fa-calendar-days me-1" /> Jul 2026</span>
                      </div>
                      <h4 className="display-font course-title">Automating Financial Reporting Pipelines</h4>
                      <p className="course-desc">Stop doing manual data entry. We show you how to securely pipe financial data across APIs to generate automated end-of-month reports.</p>
                      <div className="course-footer">
                        <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="watch-link">
                          <i className="fa-brands fa-youtube" style={{color: '#FF0000', fontSize: 18}} /> Watch on YouTube
                        </a>
                        <span className="text-muted small">2.2K Views</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Course 6 */}
                <div className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="course-thumbnail">
                      <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" alt="Consulting" />
                      <div className="play-btn-overlay"><i className="fa-solid fa-play" /></div>
                      <div className="course-duration">41:30</div>
                    </a>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-badge" style={{background: 'rgba(10,34,72,0.1)', color: 'var(--color-navy)'}}>Consulting</span>
                        <span className="text-muted small"><i className="fa-solid fa-calendar-days me-1" /> Jun 2026</span>
                      </div>
                      <h4 className="display-font course-title">Choosing the Right Tech Stack in 2026</h4>
                      <p className="course-desc">React, Vue, Node, Python? A comprehensive breakdown of modern frameworks to help stakeholders make informed, cost-effective infrastructure decisions.</p>
                      <div className="course-footer">
                        <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="watch-link">
                          <i className="fa-brands fa-youtube" style={{color: '#FF0000', fontSize: 18}} /> Watch on YouTube
                        </a>
                        <span className="text-muted small">4.8K Views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* View More Channel Button */}
              <div className="text-center mt-5 pt-4">
                <a href="https://youtube.com/@AyindeTechnologies" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold shadow-sm" style={{fontSize: 15}}>
                  View Full Library on YouTube ↗
                </a>
              </div>
            </div>
          </section>
          {/* === Newsletter Section === */}
          <NewsletterSection />
        </div>
      </div>
      
    </>
  );
};

export default Courses;