import React, { useState, useEffect } from 'react';
import { api } from '../api';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [maleTeamMembers, setMaleTeamMembers] = useState([]);
  const [femaleTeamMembers, setFemaleTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch achievements
      try {
        console.log('[AchievementsPage] Fetching achievements...');
        const achievementsResponse = await api.getAchievements();
        setAchievements(achievementsResponse.achievements || []);
        console.log('[AchievementsPage] Achievements loaded:', achievementsResponse.achievements?.length || 0);
      } catch (err) {
        console.warn('[AchievementsPage] Achievements fetch failed:', err.message);
        setAchievements([]);
      }

      // Try to fetch male team members
      try {
        console.log('[AchievementsPage] Fetching male team members...');
        const maleResponse = await api.getTeamMembersByGender('male');
        setMaleTeamMembers(maleResponse.team_members || []);
        console.log('[AchievementsPage] Male team members loaded:', maleResponse.team_members?.length || 0);
      } catch (err) {
        console.warn('[AchievementsPage] Male team members fetch failed:', err.message);
        setMaleTeamMembers([]);
      }

      // Try to fetch female team members
      try {
        console.log('[AchievementsPage] Fetching female team members...');
        const femaleResponse = await api.getTeamMembersByGender('female');
        setFemaleTeamMembers(femaleResponse.team_members || []);
        console.log('[AchievementsPage] Female team members loaded:', femaleResponse.team_members?.length || 0);
      } catch (err) {
        console.warn('[AchievementsPage] Female team members fetch failed:', err.message);
        setFemaleTeamMembers([]);
      }
    } catch (err) {
      console.error('[AchievementsPage] Unexpected error:', err);
      setError('Failed to load achievements and team data');
    } finally {
      setLoading(false);
    }
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

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingTop: '60px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }}>
            Our Achievements 🎯
          </h1>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Milestones and successes that define our journey
          </p>
        </div>

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af', marginBottom: '40px', textAlign: 'center' }}>
              Company Milestones
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb',
                    transition: 'transform 0.3s, box-shadow 0.3s'
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
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                    {achievement.icon || '🏆'}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
                    {achievement.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {achievement.description}
                  </p>
                  {achievement.category && (
                    <div style={{
                      marginTop: '15px',
                      display: 'inline-block',
                      padding: '6px 12px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#1e40af',
                      fontWeight: 'bold'
                    }}>
                      {achievement.category}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {(maleTeamMembers.length > 0 || femaleTeamMembers.length > 0) && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af', marginBottom: '40px', textAlign: 'center' }}>
              Meet Our Team 👥
            </h2>

            {/* Male Team Members */}
            {maleTeamMembers.length > 0 && (
              <div style={{ marginBottom: '60px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px', textAlign: 'center' }}>
                  Leadership Team (Male)
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '30px'
                }}>
                  {maleTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}
                    >
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '5px' }}>
                          {member.name}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                          {member.title}
                        </p>
                        {member.quote && (
                          <p style={{ fontSize: '13px', color: '#999', fontStyle: 'italic', marginBottom: '10px' }}>
                            "{member.quote}"
                          </p>
                        )}
                        {member.achievement && (
                          <p style={{ fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>
                            ⭐ {member.achievement}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Female Team Members */}
            {femaleTeamMembers.length > 0 && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px', textAlign: 'center' }}>
                  Leadership Team (Female)
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '30px'
                }}>
                  {femaleTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}
                    >
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '5px' }}>
                          {member.name}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                          {member.title}
                        </p>
                        {member.quote && (
                          <p style={{ fontSize: '13px', color: '#999', fontStyle: 'italic', marginBottom: '10px' }}>
                            "{member.quote}"
                          </p>
                        )}
                        {member.achievement && (
                          <p style={{ fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>
                            ⭐ {member.achievement}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Data Message */}
        {achievements.length === 0 && maleTeamMembers.length === 0 && femaleTeamMembers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              Achievements and team data are coming soon! 🚀
            </p>
            {error && (
              <p style={{ fontSize: '14px', color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                ⚠️ {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;