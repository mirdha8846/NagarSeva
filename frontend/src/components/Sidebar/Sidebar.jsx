import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'authority';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/community', label: 'Community Feed', icon: 'groups' },
    { path: '/projects', label: 'Govt. Projects', icon: 'account_balance' },
    { path: '/authority', label: 'Civic Directory', icon: 'badge' },
    ...(isAdmin ? [{ path: '/authority-portal', label: 'Authority Portal', icon: 'admin_panel_settings' }] : []),
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
        <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
