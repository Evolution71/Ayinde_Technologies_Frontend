import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';  // ✅ FIXED: Default import

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user && user.id) {
          // Fetch user's projects (if endpoint exists)
          // const data = await api.getUserProjects();
          // setProjects(data);
          // For now, show empty state
          setProjects([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading projects...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1>🎯 Your Projects</h1>

        {projects.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <h2>No projects yet</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Complete course lessons and projects will appear here
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {projects.map(project => (
              <div
                key={project.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <h3>{project.title}</h3>
                <p style={{ color: '#666' }}>{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#1e40af',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;