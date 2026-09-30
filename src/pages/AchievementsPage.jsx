import React, { useState } from 'react';

const AchievementsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const achievements = [
    {
      id: 1,
      title: '500+ Successful Projects Delivered',
      description: 'Successfully completed and deployed 500+ projects across various industries and sectors',
      category: 'general',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Industry Award - Best Tech Innovation 2024',
      description: 'Recognized by the Global Tech Innovation Awards for groundbreaking solutions',
      category: 'general',
      icon: '🏆'
    },
    {
      id: 3,
      title: 'Trusted by 1000+ Businesses',
      description: 'Serving clients from startups to Fortune 500 companies worldwide',
      category: 'general',
      icon: '🤝'
    },
    {
      id: 4,
      title: '99.9% Client Satisfaction Rate',
      description: 'Consistently maintaining exceptional service quality and client satisfaction',
      category: 'general',
      icon: '⭐'
    },
    {
      id: 5,
      title: 'ISO 27001 Certified',
      description: 'Certified for information security management and data protection standards',
      category: 'general',
      icon: '🔒'
    },
    {
      id: 6,
      title: '$50M+ in Client Revenue Generated',
      description: 'Helped clients generate over $50 million in additional revenue through digital transformation',
      category: 'general',
      icon: '💰'
    }
  ];

  const maleCEOQuotes = [
    {
      id: 1,
      name: 'Ayinde Okafor',
      title: 'Founder & CEO',
      quote: 'At Ayinde Technologies, we believe technology should empower businesses, not complicate them. Our mission is to make cutting-edge solutions accessible to everyone.',
      image: '👨‍💼',
      achievement: 'Led the company to $10M+ annual revenue in 5 years'
    },
    {
      id: 2,
      name: 'James Mitchell',
      title: 'Chief Innovation Officer',
      quote: 'Innovation is at the heart of everything we do. We invest heavily in research and development to ensure our clients always stay ahead of the curve.',
      image: '👨‍💻',
      achievement: 'Spearheaded development of 50+ proprietary technologies'
    },
    {
      id: 3,
      name: 'David Chen',
      title: 'Chief Technology Officer',
      quote: 'Our technical excellence comes from hiring the best talent and creating an environment where they can thrive. Quality is never compromised.',
      image: '👨‍🔬',
      achievement: 'Built a team of 200+ world-class engineers'
    }
  ];

  const femaleCEOQuotes = [
    {
      id: 1,
      name: 'Amara Johnson',
      title: 'Chief Operating Officer',
      quote: 'Operational excellence is what enables us to deliver consistent, high-quality results. We obsess over details so our clients don\'t have to.',
      image: '👩‍💼',
      achievement: 'Streamlined operations to improve delivery time by 40%'
    },
    {
      id: 2,
      name: 'Sofia Garcia',
      title: 'Chief Marketing Officer',
      quote: 'Our clients are the foundation of our success. We listen, we adapt, and we always put their needs first. That\'s what drives us every day.',
      image: '👩‍💻',
      achievement: 'Grew client base from 100 to 1000+ in 3 years'
    },
    {
      id: 3,
      name: 'Michelle Watson',
      title: 'Chief Financial Officer',
      quote: 'We believe in transparent, fair pricing and measurable ROI. Every investment our clients make with us should deliver clear business value.',
      image: '👩‍🔬',
      achievement: 'Achieved 95% client retention rate through 5 years'
    }
  ];

  const filterAchievements = () => {
    if (activeTab === 'all') return achievements;
    return achievements.filter(a => a.category === activeTab);
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingTop: '40px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
            🏆 Achievements & Milestones
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Celebrating our success and the success of our partners
          </p>
        </div>

        {/* Key Achievements */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#1f2937', textAlign: 'center' }}>
            Our Key Achievements
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {filterAchievements().map((achievement) => (
              <div key={achievement.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '2px solid transparent',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>{achievement.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
                  {achievement.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Male Leadership Quotes */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#1f2937', textAlign: 'center' }}>
            👨‍💼 Male Leadership Team
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {maleCEOQuotes.map((leader) => (
              <div key={leader.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: '5px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '48px', marginRight: '15px' }}>{leader.image}</div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1f2937' }}>
                      {leader.name}
                    </h3>
                    <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>
                      {leader.title}
                    </p>
                  </div>
                </div>

                <blockquote style={{
                  fontStyle: 'italic',
                  color: '#555',
                  marginBottom: '15px',
                  paddingLeft: '15px',
                  borderLeft: '3px solid #3b82f6',
                  fontSize: '15px',
                  lineHeight: '1.7'
                }}>
                  "{leader.quote}"
                </blockquote>

                <div style={{
                  backgroundColor: '#eff6ff',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#1e40af',
                  fontWeight: '500'
                }}>
                  ✓ {leader.achievement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Female Leadership Quotes */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#1f2937', textAlign: 'center' }}>
            👩‍💼 Female Leadership Team
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {femaleCEOQuotes.map((leader) => (
              <div key={leader.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: '5px solid #ec4899'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '48px', marginRight: '15px' }}>{leader.image}</div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1f2937' }}>
                      {leader.name}
                    </h3>
                    <p style={{ margin: 0, color: '#ec4899', fontSize: '14px', fontWeight: '600' }}>
                      {leader.title}
                    </p>
                  </div>
                </div>

                <blockquote style={{
                  fontStyle: 'italic',
                  color: '#555',
                  marginBottom: '15px',
                  paddingLeft: '15px',
                  borderLeft: '3px solid #ec4899',
                  fontSize: '15px',
                  lineHeight: '1.7'
                }}>
                  "{leader.quote}"
                </blockquote>

                <div style={{
                  backgroundColor: '#fce7f3',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#831843',
                  fontWeight: '500'
                }}>
                  ✓ {leader.achievement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
            By The Numbers
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '10px' }}>500+</div>
              <p style={{ color: '#666' }}>Projects Delivered</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '10px' }}>1000+</div>
              <p style={{ color: '#666' }}>Satisfied Clients</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '10px' }}>99.9%</div>
              <p style={{ color: '#666' }}>Client Satisfaction</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>50M+</div>
              <p style={{ color: '#666' }}>Client Revenue Generated</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' }}>15+</div>
              <p style={{ color: '#666' }}>Years of Excellence</p>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>200+</div>
              <p style={{ color: '#666' }}>Team Members</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          marginTop: '60px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
            Ready to Join Our Success Stories?
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '25px', opacity: 0.9 }}>
            Let's work together to achieve your business goals and create your own success story
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/services" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'white',
              color: '#3b82f6',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Explore Services
            </a>
            <a href="#contact" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              border: '2px solid white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;