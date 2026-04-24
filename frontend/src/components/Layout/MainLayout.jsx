import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* TopNavBar */}
        <header className="dash-header">
          <div className="header-left">
            <button className="mobile-trigger">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="header-meta">
              <span style={{ fontWeight: 500 }}>Ward 42, Pune</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ fontWeight: 500, cursor: 'pointer' }}>English | हिंदी</span>
            </div>
          </div>
          <div className="header-right">
            <button className="help-button" style={{ padding: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#475569' }}>notifications</span>
            </button>
            <Link to="/profile">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANav_ojuZlGuGVtMWnXF7VLlvKTC24GhNI7ayKl87OjEYVSQ5_jqnaQOnTvIbJSGUnx3P2Rjb9yupypI8GqIW2djW5-WwVmH0QKgCix7l6_HTw_GZX630NZeizGy5cLaV37NvWXQyyns9IDfP5JhO8l2V-MMoHr3aZu1xGJyjBpK0IOn5am-yMLqK9QGddWXin4bQCGTJhz8x6aTH0XfoMMaEyfMcLxwgsOoouQQoK5-jrFapP4WPamqtjwM8kABjDacPwGxr0b0o" 
                alt="User" 
                className="user-avatar"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="dash-content">
          <div className="max-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
