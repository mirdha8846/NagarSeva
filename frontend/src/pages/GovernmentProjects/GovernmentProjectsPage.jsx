import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import './GovernmentProjectsPage.css';

const GovernmentProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await apiClient.get('/projects');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'on_hold': return 'On Hold';
      default: return 'Upcoming';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'on_hold': return 'status-delayed';
      default: return '';
    }
  };

  const getAccentColor = (status) => {
    switch (status) {
      case 'active': return 'var(--primary)';
      case 'completed': return 'var(--tertiary)';
      case 'on_hold': return 'var(--error)';
      default: return 'var(--outline)';
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading projects...</div>;

  return (
    <div className="projects-container">
      <header className="projects-header">
        <h1>Government Projects — Ward 42</h1>
        <p>12 active projects • ₹4.2 Cr allocated</p>
      </header>

      <div className="projects-list">
        {projects.length > 0 ? projects.map((project) => {
          const budgetPct = project.budgetAllocated > 0 ? Math.round((project.budgetUsed / project.budgetAllocated) * 100) : 0;
          const accentColor = getAccentColor(project.status);
          
          return (
            <article key={project._id} className="project-card">
              <div className="project-accent" style={{ backgroundColor: accentColor }}></div>
              
              <div className="card-top">
                <div className="project-info">
                  <h3>
                    {project.title}
                    <span className="dept-badge">PMC</span>
                  </h3>
                  <p className="project-desc">{project.description}</p>
                </div>

                <div className={`status-badge ${getStatusClass(project.status)}`}>
                  {project.status === 'active' && <div className="pulse-dot"></div>}
                  {project.status === 'completed' && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>}
                  {project.status === 'on_hold' && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>}
                  {getStatusLabel(project.status)}
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-header">
                    <span>Physical Progress</span>
                    <span className="metric-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${project.progress}%`, backgroundColor: accentColor }}
                    ></div>
                  </div>
                </div>

                <div className="metric-item">
                  <div className="metric-header">
                    <span>{project.status === 'completed' ? 'Final Expenditure' : 'Budget Utilization'}</span>
                    <span className="metric-value">₹{(project.budgetUsed/100000).toFixed(1)}L / ₹{(project.budgetAllocated/100000).toFixed(1)}L</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${budgetPct}%`, backgroundColor: project.status === 'completed' ? 'var(--tertiary)' : 'var(--secondary)' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="contacts">
                  <div className="contact-info">
                    <span className="contact-label">Reporting Authority</span>
                    <span className="contact-name">Ward 42 Office</span>
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">{project.status === 'completed' ? 'Completion Date' : 'Estimated End'}</span>
                    <span className="contact-name">{project.timeline?.endDate ? new Date(project.timeline.endDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
                <button className="view-btn">View Details</button>
              </div>
            </article>
          )
        }) : <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.6 }}>No projects currently active in this ward.</p>}
      </div>
    </div>
  );
};

export default GovernmentProjectsPage;
