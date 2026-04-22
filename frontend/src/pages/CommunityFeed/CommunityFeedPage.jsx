import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './CommunityFeedPage.css';

const IssueCard = ({ id, category, time, title, description, images, author, likes: initialLikes, dislikes: initialDislikes, comments, support }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [dislikes, setDislikes] = useState(initialDislikes || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setDisdislikes(dislikes - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisdislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDisdislikes(dislikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
  };

  const setDisdislikes = (val) => setDislikes(val); // Helper for the logic above

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
      <p className="card-description">{description}</p>
      {images && images.length > 0 && <img src={`http://localhost:5000/${images[0]}`} alt={title} className="card-image" />}
      
      <div className="card-author">
        <div className="author-info">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          <span>@{author || 'anonymous'}</span>
        </div>
        <div className="social-actions">
          <button className={`social-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
            <span className={`material-symbols-outlined ${liked ? 'fill' : ''}`} style={{ fontSize: '18px' }}>
              thumb_up
            </span>
            {likes}
          </button>
          <button className={`social-btn ${disliked ? 'active' : ''}`} onClick={handleDislike}>
            <span className={`material-symbols-outlined ${disliked ? 'fill' : ''}`} style={{ fontSize: '18px' }}>
              thumb_down
            </span>
            {dislikes}
          </button>
          <button className="social-btn">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat_bubble</span>
            {comments || 0}
          </button>
        </div>
      </div>
    </article>
  );
};

const CommunityFeedPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {};
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

  useEffect(() => {
    fetchIssues();
  }, [category]); // Re-fetch on category change

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
        <div className="feed-header">
          <span className="feed-count">Showing {total} issues</span>
          <select className="sort-select">
            <option>Recent</option>
            <option>Most Supported</option>
          </select>
        </div>
        <div className="feed-list">
          {loading ? (
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
                images={issue.images}
                author={issue.userId?.name}
                likes={0}
                dislikes={0}
                comments={0}
                support={Math.floor(Math.random() * 40) + 60} // Decorative for now
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>No issues found.</div>
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
          <div className="petition-item">
            <h4 className="petition-title">Fix all potholes on FC Road</h4>
            <div className="petition-stats">
              <span>SIGNATURES</span>
              <span>4,500 / 5,000</span>
            </div>
            <div className="progress-container" style={{ height: '6px', marginBottom: '12px' }}>
              <div className="progress-fill" style={{ backgroundColor: 'var(--primary)', width: '90%', height: '6px' }}></div>
            </div>
            <button className="login-button" style={{ backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', height: '32px', fontSize: '12px' }}>
              Sign Petition
            </button>
          </div>
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
    </div>
  );
};

export default CommunityFeedPage;
