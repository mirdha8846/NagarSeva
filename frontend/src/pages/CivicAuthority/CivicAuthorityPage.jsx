import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import './CivicAuthorityPage.css';

const CivicAuthorityPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'authority';
  
  const [officers, setOfficers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory'); // directory, projects, issues
  
  // Form states for creating project
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', budgetAllocated: 0 });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [authRes, projectsRes, issuesRes] = await Promise.all([
        apiClient.get('/auth/authority'),
        apiClient.get('/projects'),
        apiClient.get('/issues')
      ]);
      setOfficers(authRes.data);
      setProjects(projectsRes.data);
      setIssues(issuesRes.data.issues || issuesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (id, updates) => {
    try {
      await apiClient.patch(`/projects/${id}`, updates);
      fetchData(); // Refresh data
    } catch (error) {
      alert('Failed to update project');
    }
  };

  const handleUpdateIssue = async (id, updates) => {
    try {
      await apiClient.patch(`/issues/${id}/status`, updates);
      fetchData(); // Refresh data
    } catch (error) {
      alert('Failed to update issue');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/projects', newProject);
      setShowProjectModal(false);
      setNewProject({ title: '', description: '', budgetAllocated: 0 });
      fetchData();
    } catch (error) {
      alert('Failed to create project');
    }
  };

  const departments = [
    { title: 'Water Supply', icon: 'water_drop', phone: '+91 20 2567-XXXX', extension: 'ext 104' },
    { title: 'Solid Waste', icon: 'delete_sweep', phone: '+91 20 2567-XXXX', extension: 'ext 201' },
    { title: 'Road Maintenance', icon: 'edit_road', phone: '+91 20 2567-XXXX', extension: 'ext 305' },
    { title: 'Electricity (MSEB)', icon: 'bolt', phone: '+91 20 2567-XXXX', extension: 'ext 442' },
    { title: 'Parks & Recreation', icon: 'park', phone: '+91 20 2567-XXXX', extension: 'ext 512' },
    { title: 'Birth/Death Reg.', icon: 'description', phone: '+91 20 2567-XXXX', extension: 'ext 001' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Civic Data...</div>;

  return (
    <div className="authority-container">
      <header className="authority-header">
        <h1>{isAdmin ? 'Civic Administration Dashboard' : 'Civic Authority Directory'}</h1>
        <p>{isAdmin ? 'Manage ward projects and monitor citizen reports.' : 'Know the officials responsible for your ward’s governance.'}</p>
      </header>

      {isAdmin && (
        <nav className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            Directory
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Manage Projects
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            Manage Issues
          </button>
        </nav>
      )}

      {/* Directory View - Visible to everyone if selected */}
      {activeTab === 'directory' && (
        <>
          <div className="authority-grid">
            {officers.length > 0 ? officers.map((officer) => (
              <div key={officer._id} className="officer-card">
                <div className="officer-avatar">
                  {officer.avatar ? (
                    <img src={officer.avatar} alt={officer.name} />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
                <h3 className="officer-name">{officer.name}</h3>
                <span className="officer-role">{officer.role?.toUpperCase() || 'OFFICIAL'}</span>
                <p className="officer-bio">
                  {officer.bio || 'Dedicated to ensuring transparent governance and efficient administrative services for all citizens of Ward 42.'}
                </p>
                <div className="contact-row">
                  <button className="contact-btn primary">Email Office</button>
                  <button className="contact-btn secondary">Request Meeting</button>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.6 }}>No officers currently listed for this ward.</p>}
          </div>

          <div className="dept-section">
            <h2>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>help_center</span>
              Departmental Helplines
            </h2>
            <div className="dept-grid">
              {departments.map((dept, idx) => (
                <div key={idx} className="dept-card">
                  <div className="dept-icon">
                    <span className="material-symbols-outlined">{dept.icon}</span>
                  </div>
                  <span className="dept-title">{dept.title}</span>
                  <div className="dept-contact">
                    <div className="dept-phone">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                      {dept.phone}
                    </div>
                    <div className="dept-phone" style={{ fontSize: '12px', color: '#64748b' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call_received</span>
                      {dept.extension}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Admin: Manage Projects View */}
      {isAdmin && activeTab === 'projects' && (
        <div className="admin-section">
          <div className="section-header-row">
            <h3>Active Ward Projects</h3>
            <button className="btn-primary" onClick={() => setShowProjectModal(true)}>
              <span className="material-symbols-outlined">add</span> New Project
            </button>
          </div>
          
          <div className="admin-card-list">
            {projects.map(project => (
              <div key={project._id} className="admin-card">
                <div className="admin-card-info">
                  <h4 className="admin-card-title">{project.title}</h4>
                  <p className="admin-card-subtitle">Budget: ₹{(project.budgetAllocated/100000).toFixed(1)}L | Progress: {project.progress}%</p>
                </div>
                <div className="admin-actions">
                  <div className="progress-input-group">
                    <label>Progress %</label>
                    <input 
                      type="number" 
                      className="progress-input" 
                      value={project.progress} 
                      onChange={(e) => handleUpdateProject(project._id, { progress: parseInt(e.target.value) })}
                      min="0" max="100"
                    />
                  </div>
                  <select 
                    className="status-select"
                    value={project.status}
                    onChange={(e) => handleUpdateProject(project._id, { status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin: Manage Issues View */}
      {isAdmin && activeTab === 'issues' && (
        <div className="admin-section">
          <div className="section-header-row">
            <h3>Citizen Reported Issues</h3>
          </div>
          
          <div className="admin-card-list">
            {issues.map(issue => (
              <div key={issue._id} className="admin-card">
                <div className="admin-card-info">
                  <h4 className="admin-card-title">{issue.title}</h4>
                  <p className="admin-card-subtitle">{issue.category} • {issue.userId?.name || 'Anonymous'}</p>
                  <p className="admin-card-subtitle" style={{ marginTop: '4px' }}>Resolution Progress: {issue.progress || 0}%</p>
                </div>
                <div className="admin-actions">
                  <div className="progress-input-group">
                    <label>Resolution %</label>
                    <input 
                      type="number" 
                      className="progress-input" 
                      value={issue.progress || 0} 
                      onChange={(e) => handleUpdateIssue(issue._id, { progress: parseInt(e.target.value) })}
                      min="0" max="100"
                    />
                  </div>
                  <select 
                    className="status-select"
                    value={issue.status}
                    onChange={(e) => handleUpdateIssue(issue._id, { status: e.target.value })}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Launch New Ward Project</h2>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowProjectModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Smart LED Streetlight Installation"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required rows="3"
                  placeholder="Details about the work scope..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Allocated Budget (₹)</label>
                <input 
                  type="number" required
                  placeholder="Amount in Rupees"
                  value={newProject.budgetAllocated}
                  onChange={(e) => setNewProject({...newProject, budgetAllocated: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowProjectModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Launch Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div style={{ marginTop: '64px', padding: '24px', border: '1px dashed var(--outline-variant)', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>
            Cant find who you are looking for? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse the full PMC Directory</a> or <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Report an administrative issue</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default CivicAuthorityPage;
