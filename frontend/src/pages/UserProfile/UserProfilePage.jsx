import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './UserProfilePage.css';

const TABS = ['My Reports', 'Activity', 'Voted Issues'];

const UserProfilePage = () => {
  const { user, updateUserProfile: updateContext } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Reports');
  const [userIssues, setUserIssues] = useState([]);
  const [votedIssues, setVotedIssues] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [votedLoading, setVotedLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.put('/auth/profile', editForm);
      updateContext(data);
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Fetch user's reported issues
  useEffect(() => {
    const fetchUserIssues = async () => {
      if (!user?._id) return;
      try {
        const { data } = await apiClient.get('/issues', {
          params: { userId: user._id }
        });
        setUserIssues(data.issues || data);
      } catch (error) {
        console.error('Error fetching user issues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserIssues();
  }, [user?._id]);

  // Fetch voted issues when tab is selected
  useEffect(() => {
    if (activeTab !== 'Voted Issues') return;
    const fetchVotedIssues = async () => {
      setVotedLoading(true);
      try {
        const { data } = await apiClient.get('/votes/my-votes');
        setVotedIssues(data);
      } catch (error) {
        console.error('Error fetching voted issues:', error);
      } finally {
        setVotedLoading(false);
      }
    };
    fetchVotedIssues();
  }, [activeTab]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  const resolvedCount = userIssues.filter(i => i.status === 'resolved').length;
  const resolutionRate = userIssues.length > 0 ? Math.round((resolvedCount / userIssues.length) * 100) : 0;

  // Build a simple activity log from userIssues (sorted by most recent)
  const activityLog = [...userIssues].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(issue => ({
    id: issue._id,
    type: issue.status === 'resolved' ? 'resolved' : issue.status === 'in_progress' ? 'progress' : 'reported',
    icon: issue.status === 'resolved' ? 'check_circle' : issue.status === 'in_progress' ? 'pending_actions' : 'report',
    iconColor: issue.status === 'resolved' ? '#059669' : issue.status === 'in_progress' ? '#D97706' : 'var(--primary)',
    text: issue.status === 'resolved'
      ? `Your report "${issue.title}" was resolved`
      : issue.status === 'in_progress'
      ? `"${issue.title}" is now being worked on`
      : `You reported "${issue.title}"`,
    date: new Date(issue.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  }));

  return (
    <div className="profile-wrapper">
      {/* Page Header */}
      <div className="profile-header">
        <h2 className="register-title" style={{ fontSize: '28px' }}>User Profile</h2>
      </div>

      <div className="profile-content-grid">
        {/* Left Column - Identity & Reputation */}
        <aside className="profile-sidebar">
          {/* Identity Card */}
          <div className="profile-card identity-card">
            <div className="avatar-section">
              <div className="profile-avatar-outer">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop"} 
                  alt={user?.name} 
                  className="profile-avatar-img"
                />
                <div className="verified-badge">
                  <span className="material-symbols-outlined">check</span>
                </div>
              </div>
              <h3 className="profile-name">{user?.name}</h3>
              <p className="profile-location">
                <span className="material-symbols-outlined">mail</span>
                {user?.email}
              </p>
              {user?.phone && (
                <p className="profile-location">
                  <span className="material-symbols-outlined">call</span>
                  {user.phone}
                </p>
              )}
              <div className="member-since">Member since {new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
            </div>
            
            <div className="profile-actions">
              <button className="login-button" style={{ height: '36px', fontSize: '13px' }} onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
            </div>
          </div>

          {/* Reputation Card */}
          <div className="profile-card reputation-card">
            <div className="rep-header">
              <div className="rep-info">
                <span className="rep-label">Civic Reputation</span>
                <div className="rep-score">{user?.points || 0} <span className="rep-unit">pts</span></div>
              </div>
              <div className="rep-rank-icon">
                <span className="material-symbols-outlined fill">shield</span>
                <span className="rank-name">{user?.points > 1000 ? 'Gold Rank' : user?.points > 500 ? 'Silver Rank' : 'Bronze Rank'}</span>
              </div>
            </div>
            <div className="rep-progress-section">
              <div className="rep-progress-meta">
                <span>{user?.points > 500 ? 'Silver' : 'Bronze'}</span>
                <span>{user?.points > 1000 ? 'Max Rank' : `${1000 - (user?.points || 0)} pts to Gold`}</span>
              </div>
              <div className="progress-container" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${Math.min(100, ((user?.points || 0) / 1000) * 100)}%`, backgroundColor: 'var(--primary)', height: '8px' }}></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="profile-stats-grid">
            <div className="mini-stat-card">
              <span className="mini-stat-label">Reports</span>
              <div className="mini-stat-value">{userIssues.length}</div>
            </div>
            <div className="mini-stat-card">
              <span className="mini-stat-label">Resolved</span>
              <div className="mini-stat-value">{resolvedCount} <span className="stat-perc">{resolutionRate}%</span></div>
            </div>
            <div className="mini-stat-card">
              <span className="mini-stat-label">Voted</span>
              <div className="mini-stat-value">{votedIssues.length || '—'}</div>
            </div>
            <div className="mini-stat-card">
              <span className="mini-stat-label">Activity</span>
              <div className="mini-stat-value">{activityLog.length}</div>
            </div>
          </div>

          {/* Badges */}
          <div className="profile-card badges-card">
            <h4 className="card-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Earned Badges</h4>
            <div className="badge-belt">
              {user?.badges && user.badges.length > 0 ? user.badges.map((badge, idx) => (
                <div key={idx} className={`badge-item ${badge.toLowerCase()}`}>
                  <span className="material-symbols-outlined fill">verified</span>
                </div>
              )) : (
                <>
                  <div className="badge-item star"><span className="material-symbols-outlined fill">star</span></div>
                  <div className="badge-item verified"><span className="material-symbols-outlined fill">verified</span></div>
                  <div className="badge-item disabled"><span className="material-symbols-outlined fill">emoji_events</span></div>
                </>
              )}
            </div>
            <button className="view-all-btn">VIEW ALL BADGES</button>
          </div>
        </aside>

        {/* Right Column - Main Content */}
        <main className="profile-main-content">
          <nav className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Tab: My Reports */}
          {activeTab === 'My Reports' && (
            <div className="reports-list">
              {userIssues.length > 0 ? userIssues.map(issue => (
                <ReportItem 
                  key={issue._id}
                  id={issue._id.slice(-6).toUpperCase()}
                  status={issue.status}
                  statusClass={issue.status === 'resolved' ? 'status-success' : issue.status === 'in_progress' ? 'status-warn' : ''}
                  title={issue.title}
                  desc={issue.description}
                  progress={issue.progress || 0}
                  statusUpdates={issue.statusUpdates || []}
                  date={new Date(issue.createdAt).toLocaleDateString()}
                  votes={issue.votesCount || 0}
                  image={issue.images?.[0] ? `http://localhost:5000/${issue.images[0]}` : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"}
                  fixedDate={issue.status === 'resolved' ? new Date(issue.updatedAt).toLocaleDateString() : null}
                  onTrackStatus={setSelectedTimeline}
                />
              )) : (
                <div className="empty-history">
                  <span className="material-symbols-outlined">history</span>
                  <h4>No reports found</h4>
                  <p>You haven't submitted any issues yet.</p>
                  <button className="outline-btn" onClick={() => navigate('/report-issue')}>FILE NEW REPORT</button>
                </div>
              )}
            </div>
          )}

          {/* Tab: Activity */}
          {activeTab === 'Activity' && (
            <div className="reports-list">
              {activityLog.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activityLog.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', backgroundColor: 'var(--surface-container)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${item.iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ color: item.iconColor, fontSize: '20px' }}>{item.icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--on-surface)' }}>{item.text}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--on-surface-variant)' }}>{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-history">
                  <span className="material-symbols-outlined">timeline</span>
                  <h4>No activity yet</h4>
                  <p>Your civic actions will appear here once you start reporting issues.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Voted Issues */}
          {activeTab === 'Voted Issues' && (
            <div className="reports-list">
              {votedLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading voted issues...</div>
              ) : votedIssues.length > 0 ? (
                votedIssues.map(issue => (
                  <div key={issue._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', backgroundColor: 'var(--surface-container)', borderRadius: '12px', border: '1px solid var(--outline-variant)', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: issue.voteType === 'upvote' ? '#ECFDF5' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: issue.voteType === 'upvote' ? '#059669' : 'var(--error)', fontSize: '20px' }}>
                        {issue.voteType === 'upvote' ? 'thumb_up' : 'thumb_down'}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{issue.title}</h4>
                        <span style={{ 
                          fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
                          backgroundColor: issue.status === 'resolved' ? '#ECFDF5' : issue.status === 'in_progress' ? '#FFFBEB' : 'var(--error-container)',
                          color: issue.status === 'resolved' ? '#059669' : issue.status === 'in_progress' ? '#D97706' : 'var(--on-error-container)'
                        }}>
                          {issue.status}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 8px 0', fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>{issue.description?.slice(0, 100)}...</p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>category</span>
                          {issue.category}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>thumb_up</span>
                          {issue.votesCount || 0} votes
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>
                          by {issue.userId?.name || 'Anonymous'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-history">
                  <span className="material-symbols-outlined">how_to_vote</span>
                  <h4>No voted issues</h4>
                  <p>Issues you upvote or downvote will appear here.</p>
                  <button className="outline-btn" onClick={() => navigate('/community')}>BROWSE ISSUES</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Timeline Modal */}
      {selectedTimeline && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Issue Timeline</h2>
              <button onClick={() => setSelectedTimeline(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{selectedTimeline.title}</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className={`status-pill ${selectedTimeline.status}`} style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                  {selectedTimeline.status}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{selectedTimeline.progress}% Complete</span>
              </div>
            </div>

            <div className="timeline-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px' }}>
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--outline-variant)' }}></div>
              
              {selectedTimeline.statusUpdates?.length > 0 ? [...selectedTimeline.statusUpdates].reverse().map((update, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '2px solid white' }}></div>
                  <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)', fontWeight: 600, marginBottom: '4px' }}>
                    {new Date(update.updatedAt).toLocaleDateString()} • {update.status.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--on-surface)', lineHeight: 1.4 }}>
                    {update.comment}
                  </div>
                </div>
              )) : (
                <div style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>No updates published yet. Check back soon.</div>
              )}
            </div>
            
            <button 
              className="login-button" 
              style={{ marginTop: '32px' }}
              onClick={() => setSelectedTimeline(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Edit Your Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">DISPLAY NAME</label>
                <input 
                  type="text" 
                  className="login-input" 
                  style={{ paddingLeft: '12px' }}
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">PHONE NUMBER</label>
                <input 
                  type="tel" 
                  className="login-input" 
                  style={{ paddingLeft: '12px' }}
                  placeholder="+91 00000 00000"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">BIO / DESCRIPTION</label>
                <textarea 
                  className="login-input" 
                  style={{ paddingLeft: '12px', paddingTop: '12px', height: '100px', resize: 'none' }}
                  placeholder="Tell the community about yourself..."
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="login-button secondary-profile-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="login-button">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportItem = ({ id, status, statusClass, title, desc, progress, statusUpdates, date, votes, image, fixedDate, onTrackStatus }) => (
  <div className="report-card-item">
    <div className="report-img-wrapper">
      <img src={image} alt={title} />
    </div>
    <div className="report-info-wrapper">
      <div className="report-card-top">
        <div className="report-meta-row">
          <span className={`status-pill ${statusClass}`}>{status}</span>
          <span className="report-id">#{id}</span>
        </div>
        <button className="icon-btn-small" onClick={() => onTrackStatus({ id, title, status, progress, statusUpdates })}>
          <span className="material-symbols-outlined">analytics</span>
        </button>
      </div>
      <h4 className="report-card-title">{title}</h4>
      <p className="report-card-desc">{desc}</p>
      
      {/* Progress Bar */}
      <div style={{ margin: '8px 0 12px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'var(--on-surface-variant)' }}>
          <span>Resolution Progress</span>
          <span>{progress || 0}%</span>
        </div>
        <div className="progress-container" style={{ height: '6px', backgroundColor: 'var(--outline-variant)' }}>
          <div 
            className="progress-fill" 
            style={{ 
              height: '6px', 
              width: `${progress || 0}%`, 
              backgroundColor: status === 'resolved' ? '#059669' : status === 'in_progress' ? '#D97706' : 'var(--primary)'
            }}
          ></div>
        </div>
      </div>
      <div className="report-card-footer">
        <div className="footer-left">
          <span className="footer-meta"><span className="material-symbols-outlined">calendar_today</span> {date}</span>
          <span className="footer-meta"><span className="material-symbols-outlined">thumb_up</span> {votes} Votes</span>
        </div>
        {fixedDate && (
          <span className="fixed-pill">
            <span className="material-symbols-outlined">check_circle</span>
            Fixed on {fixedDate}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default UserProfilePage;
