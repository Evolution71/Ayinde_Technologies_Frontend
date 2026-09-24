import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';  // ✅ NAMED import

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user) {
          const data = await api.getProjects();
          setProjects(data || []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1>🎯 Your Projects</h1>
        {projects.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '60px 20px', textAlign: 'center' }}>
            <h2>No projects yet</h2>
            <p style={{ color: '#666' }}>Complete course lessons to earn projects</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map(project => (
              <div key={project.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
                <h3>{project.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;