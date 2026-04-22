import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/community', label: 'Community Feed', icon: 'groups' },
    { path: '/projects', label: 'Govt. Projects', icon: 'account_balance' },
    { path: '/authority', label: 'Civic Authority', icon: 'badge' },
    { path: '/analytics', label: 'Ward Analytics', icon: 'monitoring' },
    { path: '/profile', label: 'Profile Settings', icon: 'settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-initial">N</div>
        <div className="brand-info">
          <h1>NagarSeva</h1>
          <p>Ward 42, Pune</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: location.pathname === item.path ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-nav" style={{ marginTop: 'auto' }}>
        <a href="#" className="sidebar-link">
          <span className="material-symbols-outlined">help</span>
          Help & Support
        </a>
        <Link to="/login" className="sidebar-link">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
