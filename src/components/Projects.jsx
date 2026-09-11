import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import AuthForms from './AuthForms';

export default function Projects() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2 className="section-title">Case Studies</h2>
        <p className="section-subtitle">Real results from real clients</p>

        {authLoading ? (
          <p className="loading">Checking login status...</p>
        ) : !user ? (
          <div className="gated-content">
            <p className="gated-message">
              Log in to view our built apps and project case studies.
            </p>
            <AuthForms />
          </div>
        ) : loading ? (
          <p className="loading">Loading projects...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">{project.image}</div>
                <h3>{project.title}</h3>
                <p className="project-client">{project.client}</p>
                <p className="project-description">{project.description}</p>
                <div className="technologies">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <div className="results">
                  {project.results.map((result, idx) => (
                    <p key={idx} className="result-item">✓ {result}</p>
                  ))}
                </div>
                {project.app_url && (
                  <a href={project.app_url} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    Open app
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
