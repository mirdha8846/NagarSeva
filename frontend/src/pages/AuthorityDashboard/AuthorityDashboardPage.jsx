import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import './AuthorityDashboardPage.css';

const AuthorityDashboardPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', progress: 0, comment: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [issuesRes, projectsRes, analyticsRes] = await Promise.all([
        apiClient.get('/issues'),
        apiClient.get('/projects'),
        apiClient.get('/analytics')
      ]);

      const fetchedIssues = issuesRes.data.issues || issuesRes.data;
      setIssues(fetchedIssues);
      setProjects(projectsRes.data);
      
      const statusStats = analyticsRes.data.statusStats || [];
      const total = fetchedIssues.length;
      const pending = fetchedIssues.filter(i => i.status !== 'resolved').length;
      const resolved = fetchedIssues.filter(i => i.status === 'resolved').length;
      
      setStats({ total, pending, resolved });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (issue) => {
    setSelectedIssue(issue);
    setUpdateForm({
      status: issue.status,
      progress: issue.progress || 0,
      comment: ''
    });
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch(`/issues/${selectedIssue._id}/status`, updateForm);
      setSelectedIssue(null);
      fetchDashboardData();
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="loading-container">Loading Authority Portal...</div>;

  return (
    <div className="authority-portal">
      <header className="portal-header">
        <div>
          <h1>Authority Dashboard</h1>
          <p>Welcome back, Official {user?.name}. You are managing Ward 42.</p>
        </div>
        <div className="portal-stats">
          <div className="mini-stat">
            <span className="stat-label">Active Reports</span>
            <span className="stat-val">{stats.pending}</span>
          </div>
          <div className="mini-stat">
            <span className="stat-label">Resolved</span>
            <span className="stat-val green">{stats.resolved}</span>
          </div>
        </div>
      </header>

      <div className="portal-grid">
        <section className="portal-main">
          <div className="section-header">
            <h3>Recent Citizen Reports</h3>
            <div className="filter-group">
              <span className="material-symbols-outlined">filter_list</span>
              <select>
                <option>All Issues</option>
                <option>Critical</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="issue-table-wrapper">
            <table className="issue-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Reporter</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue._id}>
                    <td className="mono">#{issue._id.slice(-6).toUpperCase()}</td>
                    <td>{issue.userId?.name || 'Anonymous'}</td>
                    <td><span className="tag">{issue.category}</span></td>
                    <td>
                      <span className={`status-pill ${issue.status}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      <div className="mini-progress-bg">
                        <div className="mini-progress-fill" style={{ width: `${issue.progress || 0}%` }}></div>
                      </div>
                    </td>
                    <td>
                      <button className="update-btn" onClick={() => handleUpdateClick(issue)}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="portal-sidebar">
          <div className="portal-card">
            <h3>Ward Projects</h3>
            <div className="project-stack">
              {projects.slice(0, 3).map(proj => (
                <div key={proj._id} className="proj-mini">
                  <div className="proj-info">
                    <span>{proj.title}</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="mini-progress-bg">
                    <div className="mini-progress-fill" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-link">Manage All Projects →</button>
          </div>

          <div className="portal-card alert-card">
            <div className="alert-header">
              <span className="material-symbols-outlined">warning</span>
              <h4>Urgent Attention</h4>
            </div>
            <p>3 water leakage reports in Sector 7 need immediate site inspection.</p>
            <button className="action-btn">View Reports</button>
          </div>
        </aside>
      </div>

      {/* Update Modal */}
      {selectedIssue && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Update Issue Status</h2>
              <button onClick={() => setSelectedIssue(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleStatusUpdate} className="update-form">
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={updateForm.status} 
                  onChange={e => setUpdateForm({...updateForm, status: e.target.value})}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="form-group">
                <label>Resolution Progress ({updateForm.progress}%)</label>
                <input 
                  type="range" min="0" max="100" 
                  value={updateForm.progress}
                  onChange={e => setUpdateForm({...updateForm, progress: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Official Comment / Update</label>
                <textarea 
                  required
                  placeholder="e.g. Ground team dispatched for inspection..."
                  value={updateForm.comment}
                  onChange={e => setUpdateForm({...updateForm, comment: e.target.value})}
                ></textarea>
                <p className="hint">This will be visible to the citizen in their report timeline.</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setSelectedIssue(null)}>Cancel</button>
                <button type="submit" className="submit-btn">Publish Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboardPage;
