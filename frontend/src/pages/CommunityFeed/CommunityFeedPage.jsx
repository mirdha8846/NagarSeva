import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './CommunityFeedPage.css';

const IssueCard = ({ id, category, time, title, description, progress, status, statusUpdates, images, author, likes: initialLikes, userVote, comments, petition, onStartPetition, onSignPetition, onTrackStatus }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(userVote === 'upvote');
  const [disliked, setDisliked] = useState(userVote === 'downvote');

  const handleLike = async () => {
    try {
      const { data } = await apiClient.post('/votes', { issueId: id, type: 'upvote' });
      setLikes(data.votesCount);
      setLiked(data.userVote === 'upvote');
      setDisliked(data.userVote === 'downvote');
    } catch (e) {
      console.error('Error voting', e);
    }
  };

  const handleDislike = async () => {
    try {
      const { data } = await apiClient.post('/votes', { issueId: id, type: 'downvote' });
      setLikes(data.votesCount);
      setLiked(data.userVote === 'upvote');
      setDisliked(data.userVote === 'downvote');
    } catch (e) {
      console.error('Error voting', e);
    }
  };

  return (
    <article className="feed-card">
      <div className="card-meta">
        <div className="meta-left">
          <span className="issue-id">#{id.slice(-6).toUpperCase()}</span>
          <span className="category-tag">{category}</span>
        </div>
        <span className="card-time">{new Date(time).toLocaleDateString()}</span>
      </div>
      <h3 className="card-title">{title}</h3>
      
      {/* Resolution Progress */}
      <div style={{ margin: '12px 0 16px 0', padding: '12px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>engineering</span>
            Resolution Progress
          </span>
          <span>{progress || 0}%</span>
        </div>
        <div className="progress-container" style={{ height: '8px', backgroundColor: 'var(--outline-variant)' }}>
          <div 
            className="progress-fill" 
            style={{ 
              height: '8px', 
              width: `${progress || 0}%`, 
              backgroundColor: progress === 100 ? '#059669' : progress > 0 ? '#D97706' : 'var(--primary)'
            }}
          ></div>
        </div>
      </div>

      <p className="card-description">{description}</p>
      {images && images.length > 0 && <img src={`http://localhost:5000/${images[0]}`} alt={title} className="card-image" />}
      
      {petition && (
        <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '8px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#0369A1', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_fire_department</span>
              Active Petition
            </div>
            <div style={{ fontSize: '13px', color: '#0C4A6E', marginTop: '4px' }}>
              {petition.count} supporters have signed this!
            </div>
          </div>
          <button 
            className="login-button" 
            style={{ width: 'auto', padding: '0 16px', height: '36px', fontSize: '13px' }}
            onClick={() => onSignPetition(petition._id)}
          >
            Sign Petition
          </button>
        </div>
      )}

      <div className="card-author" style={{ marginTop: petition ? '0' : '16px' }}>
        <div className="author-info">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          <span>@{author || 'anonymous'}</span>
        </div>
        <div className="social-actions">
          <button className={`social-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
            <span className={`material-symbols-outlined ${liked ? 'fill' : ''}`} style={{ fontSize: '18px' }}>thumb_up</span>
            {likes}
          </button>
          <button className={`social-btn ${disliked ? 'active' : ''}`} onClick={handleDislike}>
            <span className={`material-symbols-outlined ${disliked ? 'fill' : ''}`} style={{ fontSize: '18px' }}>thumb_down</span>
          </button>
          
          <button 
            className="social-btn" 
            style={{ color: 'var(--primary)', fontWeight: 600 }}
            onClick={() => onTrackStatus({ id, title, status, progress, statusUpdates })}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>analytics</span>
            Track Status
          </button>

          {!petition && (
            <button className="social-btn" style={{ color: 'var(--primary)', fontWeight: 500, borderColor: 'var(--primary)' }} onClick={() => onStartPetition(id, title)}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>campaign</span>
              Start Petition
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const PetitionCard = ({ petition, onSignPetition }) => {
  const percentage = Math.min((petition.count / 5000) * 100, 100);
  
  return (
    <article className="feed-card" style={{ borderLeft: '4px solid var(--primary)' }}>
      <div className="card-meta">
        <div className="meta-left">
          <span className="category-tag" style={{ backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
            Petition
          </span>
        </div>
        <span className="card-time">{new Date(petition.createdAt).toLocaleDateString()}</span>
      </div>
      <h3 className="card-title" style={{ fontSize: '20px' }}>{petition.title}</h3>
      <p className="card-description" style={{ color: 'var(--on-surface-variant)' }}>
        This action was started to address the issue: "{petition.issueId?.title || 'Unknown Issue'}".
      </p>
      
      <div style={{ margin: '20px 0 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
          <span>{petition.count?.toLocaleString() || 0} Signatures</span>
          <span>Goal: 5,000</span>
        </div>
        <div className="progress-container" style={{ height: '8px' }}>
          <div className="progress-fill" style={{ backgroundColor: 'var(--primary)', width: `${percentage}%`, height: '8px' }}></div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="login-button" style={{ width: 'auto', padding: '0 24px', height: '40px' }} onClick={() => onSignPetition(petition._id)}>
          Sign this Petition
        </button>
      </div>
    </article>
  );
};

const CommunityFeedPage = () => {
  const [issues, setIssues] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [viewMode, setViewMode] = useState('issues'); // 'issues' or 'petitions'
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const [userLocation, setUserLocation] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationFetched(true);
        },
        (error) => {
          console.log('Location disabled or error', error);
          setUserLocation(null); // show all issues as fallback
          setLocationFetched(true);
        }
      );
    } else {
      setUserLocation(null);
      setLocationFetched(true);
    }
  }, []);

  const fetchIssues = async () => {
    if (!locationFetched) return;
    setLoading(true);
    try {
      const params = {};
      if (userLocation) {
        params.lat = userLocation[0];
        params.lng = userLocation[1];
        params.dist = 50000; // 50km local radius
      }
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      
      const { data } = await apiClient.get('/issues', { params });
      setIssues(data.issues || data);
      setTotal(data.total || data.length);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPetitions = async () => {
    try {
      const { data } = await apiClient.get('/petitions');
      setPetitions(data);
    } catch (error) {
      console.error('Error fetching petitions:', error);
    }
  };

  const handleSignPetition = async (id) => {
    try {
      await apiClient.post(`/petitions/${id}/sign`);
      alert('You have successfully signed this petition!');
      fetchPetitions(); // Refetch to update the stats
    } catch (error) {
      alert(error.response?.data?.message || 'Error signing petition');
    }
  };

  const handleStartPetition = async (issueId, issueTitle) => {
    const confirmation = window.confirm(`Start a petition for: "${issueTitle}"?`);
    if (!confirmation) return;

    try {
      await apiClient.post('/petitions', { 
        title: `Action needed: Fix ${issueTitle}`, 
        issueId 
      });
      alert('Petition successfully created! You are the first supporter.');
      fetchPetitions();
      setViewMode('petitions');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating petition');
    }
  };

  useEffect(() => {
    if (locationFetched) {
      fetchIssues();
      fetchPetitions();
    }
  }, [category, locationFetched, userLocation]); // Re-fetch on category or location change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div className="feed-layout">
      {/* Left Side - Filters */}
      <aside className="filters-aside">
        <div className="card-header" style={{ borderBottom: '1px solid var(--outline-variant)', padding: '0 0 12px 0', marginBottom: '16px' }}>
          <h2 className="card-title" style={{ fontSize: '18px' }}>Filters</h2>
        </div>
        
        <div className="filter-section">
          <form onSubmit={handleSearchSubmit}>
            <h3>SEARCH</h3>
            <div className="input-wrapper" style={{ marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Search issues..." 
                className="filter-select" 
                style={{ paddingLeft: '12px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="filter-section">
          <h3>CATEGORY</h3>
          <select 
            className="filter-select" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Drainage">Drainage</option>
            <option value="Water Supply">Water Supply</option>
          </select>
        </div>
        
        <button className="login-button" style={{ height: '36px', fontSize: '14px' }} onClick={fetchIssues}>Apply Filters</button>
      </aside>

      {/* Center - Feed */}
      <div className="feed-content">
        <div className="feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className={`send-otp-btn ${viewMode === 'issues' ? 'active-tab' : ''}`} 
              style={{ backgroundColor: viewMode === 'issues' ? 'var(--primary-container)' : 'transparent', color: viewMode === 'issues' ? 'var(--on-primary-container)' : 'var(--on-surface-variant)', border: 'none', fontWeight: 600, fontSize: '15px', padding: '8px 16px', borderRadius: '100px' }}
              onClick={() => setViewMode('issues')}
            >
              Recent Issues
            </button>
            <button 
              className={`send-otp-btn ${viewMode === 'petitions' ? 'active-tab' : ''}`} 
              style={{ backgroundColor: viewMode === 'petitions' ? 'var(--primary-container)' : 'transparent', color: viewMode === 'petitions' ? 'var(--on-primary-container)' : 'var(--on-surface-variant)', border: 'none', fontWeight: 600, fontSize: '15px', padding: '8px 16px', borderRadius: '100px' }}
              onClick={() => setViewMode('petitions')}
            >
              Active Petitions
            </button>
          </div>
          
          <select className="sort-select">
            <option>Recent</option>
            <option>Most Supported</option>
          </select>
        </div>
        
        <div className="feed-list">
          {viewMode === 'issues' ? (
            loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading issues...</div>
            ) : issues.length > 0 ? (
              issues.map(issue => (
                <IssueCard 
                  key={issue._id}
                  id={issue._id}
                  category={issue.category}
                  time={issue.createdAt}
                  title={issue.title}
                  description={issue.description}
                  progress={issue.progress || 0}
                  status={issue.status}
                  statusUpdates={issue.statusUpdates || []}
                  images={issue.images}
                  author={issue.userId?.name}
                  likes={issue.votesCount || 0}
                  userVote={issue.userVote}
                  comments={0}
                  petition={petitions.find(p => p.issueId?._id === issue._id || p.issueId === issue._id)}
                  onStartPetition={handleStartPetition}
                  onSignPetition={handleSignPetition}
                  onTrackStatus={setSelectedTimeline}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>No issues found.</div>
            )
          ) : (
            petitions.length > 0 ? (
              petitions.map(petition => (
                <PetitionCard 
                  key={petition._id}
                  petition={petition}
                  onSignPetition={handleSignPetition}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>No active petitions currently running.</div>
            )
          )}
        </div>
      </div>

      {/* Right Side - Widgets */}
      <aside className="feed-aside-right">
        <div className="aside-card">
          <h2>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary-container)', fontSize: '20px' }}>local_fire_department</span>
            Active Petitions
          </h2>
          
          {petitions.length > 0 ? petitions.map(petition => (
            <div className="petition-item" key={petition._id}>
              <h4 className="petition-title">{petition.title}</h4>
              <div className="petition-stats">
                <span>SIGNATURES</span>
                <span>{petition.count?.toLocaleString() || 0} / 5,000</span>
              </div>
              <div className="progress-container" style={{ height: '6px', marginBottom: '12px' }}>
                <div className="progress-fill" style={{ backgroundColor: 'var(--primary)', width: `${Math.min((petition.count / 5000) * 100, 100)}%`, height: '6px' }}></div>
              </div>
              <button 
                className="login-button" 
                style={{ backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', height: '32px', fontSize: '12px' }}
                onClick={() => handleSignPetition(petition._id)}
              >
                Sign Petition
              </button>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--on-surface-variant)' }}>
              No active petitions found.
            </div>
          )}
        </div>

        <div className="aside-card">
          <h2>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)', fontSize: '20px' }}>tag</span>
            Trending
          </h2>
          <div className="trending-tags">
            <a href="#" className="trending-tag">#Pothole</a>
            <a href="#" className="trending-tag">#PMC</a>
            <a href="#" className="trending-tag">#WaterSupply</a>
            <a href="#" className="trending-tag">#StreetLights</a>
          </div>
        </div>
      </aside>
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
    </div>
  );
};

export default CommunityFeedPage;
