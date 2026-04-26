import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import './AuthorityDashboardPage.css';

const AuthorityDashboardPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', progress: 0, comment: '' });
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    fetchDashboardData();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

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

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/auth/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiClient.put(`/auth/users/${userId}/role`, { role: newRole });
      fetchUsers();
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('Role update error:', error);
      alert(`Failed to update role: ${message}`);
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
          <h1>{user?.role === 'admin' ? 'System Administrator' : 'Authority Dashboard'}</h1>
          <p>Welcome back, {user?.name}. You have elevated system access.</p>
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

      {user?.role === 'admin' && (
        <div className="portal-tabs" style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--outline-variant)' }}>
          <button 
            onClick={() => setActiveTab('issues')}
            style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'issues' ? '2px solid var(--primary)' : 'none', color: activeTab === 'issues' ? 'var(--primary)' : 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}
          >
            Issue Management
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : 'none', color: activeTab === 'users' ? 'var(--primary)' : 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}
          >
            Civic Team (User Mgmt)
          </button>
        </div>
      )}

      <div className="portal-grid">
        <section className="portal-main">
          {activeTab === 'issues' ? (
            <>
              <div className="section-header">
                <h3>Recent Citizen Reports</h3>
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
                        <td><span className={`status-pill ${issue.status}`}>{issue.status}</span></td>
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
            </>
          ) : (
            <>
              <div className="section-header">
                <h3>Manage Civic Team & Authorities</h3>
                <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Assign 'Authority' roles to citizens to help manage the ward.</p>
              </div>
              <div className="issue-table-wrapper">
                <table className="issue-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Current Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`status-pill ${u.role}`} style={{ backgroundColor: u.role === 'admin' ? '#7C3AED' : u.role === 'authority' ? '#059669' : '#64748b' }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {u.role !== 'authority' && (
                              <button 
                                className="update-btn" 
                                style={{ backgroundColor: '#059669' }}
                                onClick={() => handleRoleChange(u._id, 'authority')}
                              >
                                Make Authority
                              </button>
                            )}
                            {u.role === 'authority' && (
                              <button 
                                className="update-btn" 
                                style={{ backgroundColor: '#EF4444' }}
                                onClick={() => handleRoleChange(u._id, 'citizen')}
                              >
                                Revoke Access
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <aside className="portal-sidebar">
          <div className="portal-card">
            <h3>Ward Overview</h3>
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
          </div>

          <div className="portal-card alert-card">
            <div className="alert-header">
              <span className="material-symbols-outlined">verified_user</span>
              <h4>Authority Access</h4>
            </div>
            <p>Only verified officials can update issue statuses and manage government projects.</p>
          </div>
        </aside>
      </div>

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
