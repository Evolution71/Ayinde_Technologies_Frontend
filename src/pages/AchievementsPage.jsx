import React, { useState, useEffect } from 'react';
import { api } from '../api';

const AchievementsPage = () => {
  const [activeTab] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [maleTeamMembers, setMaleTeamMembers] = useState([]);
  const [femaleTeamMembers, setFemaleTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ FIXED: Fetch achievements with flexible response handling
        const achievementsResponse = await api.getAchievements();
        console.log('[AchievementsPage] Achievements response:', achievementsResponse);

        let achievementsData = [];
        if (Array.isArray(achievementsResponse)) {
          achievementsData = achievementsResponse;
        } else if (achievementsResponse?.achievements && Array.isArray(achievementsResponse.achievements)) {
          achievementsData = achievementsResponse.achievements;
        } else if (achievementsResponse?.data && Array.isArray(achievementsResponse.data)) {
          achievementsData = achievementsResponse.data;
        }
        setAchievements(achievementsData);

        // ✅ FIXED: Fetch male team members by gender with flexible response handling
        const maleResponse = await api.getTeamMembersByGender('male');
        console.log('[AchievementsPage] Male team response:', maleResponse);

        let maleData = [];
        if (Array.isArray(maleResponse)) {
          maleData = maleResponse;
        } else if (maleResponse?.team_members && Array.isArray(maleResponse.team_members)) {
          maleData = maleResponse.team_members;
        } else if (maleResponse?.members && Array.isArray(maleResponse.members)) {
          maleData = maleResponse.members;
        } else if (maleResponse?.data && Array.isArray(maleResponse.data)) {
          maleData = maleResponse.data;
        } else if (maleResponse?.results && Array.isArray(maleResponse.results)) {
          maleData = maleResponse.results;
        }
        setMaleTeamMembers(maleData);

        // ✅ FIXED: Fetch female team members by gender with flexible response handling
        const femaleResponse = await api.getTeamMembersByGender('female');
        console.log('[AchievementsPage] Female team response:', femaleResponse);

        let femaleData = [];
        if (Array.isArray(femaleResponse)) {
          femaleData = femaleResponse;
        } else if (femaleResponse?.team_members && Array.isArray(femaleResponse.team_members)) {
          femaleData = femaleResponse.team_members;
        } else if (femaleResponse?.members && Array.isArray(femaleResponse.members)) {
          femaleData = femaleResponse.members;
        } else if (femaleResponse?.data && Array.isArray(femaleResponse.data)) {
          femaleData = femaleResponse.data;
        } else if (femaleResponse?.results && Array.isArray(femaleResponse.results)) {
          femaleData = femaleResponse.results;
        }
        setFemaleTeamMembers(femaleData);

        console.log('[AchievementsPage] Loaded - achievements:', achievementsData.length, 'male:', maleData.length, 'female:', femaleData.length);
      } catch (err) {
        console.error('[AchievementsPage] Error fetching data:', err);
        setError(err.message || 'Failed to load achievements and team data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterAchievements = () => {
    if (activeTab === 'all') return achievements;
    return achievements.filter(a => a.category === activeTab);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f9fafb', paddingTop: '40px', paddingBottom: '60px', minHeight: '100vh', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ color: '#666', marginTop: '100px' }}>Loading achievements and team data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f9fafb', paddingTop: '40px', paddingBottom: '60px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{ color: '#d32f2f', marginTop: '100px' }}>Error Loading Data</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          {maleTeamMembers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>No male team members available</p>
          ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {maleTeamMembers.map((leader) => (
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
          )}
        </div>

        {/* Female Leadership Quotes */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#1f2937', textAlign: 'center' }}>
            👩‍💼 Female Leadership Team
          </h2>
          {femaleTeamMembers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>No female team members available</p>
          ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {femaleTeamMembers.map((leader) => (
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
          )}
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