import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  const resolvedCount = userIssues.filter(i => i.status === 'resolved').length;
  const resolutionRate = userIssues.length > 0 ? Math.round((resolvedCount / userIssues.length) * 100) : 0;

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
                <span className="material-symbols-outlined">location_on</span>
                Ward 42, Pune
              </p>
              <div className="member-since">Member since {new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
            </div>
            
            <div className="profile-actions">
              <button className="login-button" style={{ height: '36px', fontSize: '13px' }}>Edit Profile</button>
              <button className="login-button secondary-profile-btn">Share</button>
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
              <span className="mini-stat-label">Votes</span>
              <div className="mini-stat-value">0</div>
            </div>
            <div className="mini-stat-card">
              <span className="mini-stat-label">Comments</span>
              <div className="mini-stat-value">0</div>
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
            <button className="tab-item active">My Reports</button>
            <button className="tab-item">Activity</button>
            <button className="tab-item">Voted Issues</button>
            <button className="tab-item">Following</button>
          </nav>

          <div className="reports-list">
            {userIssues.length > 0 ? userIssues.map(issue => (
              <ReportItem 
                key={issue._id}
                id={issue._id.slice(-6).toUpperCase()}
                status={issue.status}
                statusClass={issue.status === 'resolved' ? 'status-success' : issue.status === 'in_progress' ? 'status-warn' : ''}
                title={issue.title}
                desc={issue.description}
                date={new Date(issue.createdAt).toLocaleDateString()}
                votes={0}
                image={issue.images?.[0] ? `http://localhost:5000/${issue.images[0]}` : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"}
                fixedDate={issue.status === 'resolved' ? new Date(issue.updatedAt).toLocaleDateString() : null}
              />
            )) : (
              <div className="empty-history">
                <span className="material-symbols-outlined">history</span>
                <h4>No reports found</h4>
                <p>You haven't submitted any issues in this ward yet.</p>
                <button className="outline-btn" onClick={() => navigate('/report-issue')}>FILE NEW REPORT</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const ReportItem = ({ id, status, statusClass, title, desc, date, votes, image, fixedDate }) => (
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
        <button className="icon-btn-small">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
      <h4 className="report-card-title">{title}</h4>
      <p className="report-card-desc">{desc}</p>
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
