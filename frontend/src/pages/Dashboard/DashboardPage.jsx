import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DashboardPage.css';

// Fix for default Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { animate: true });
  }, [center, map]);
  return null;
};

const StatCard = ({ icon, color, bgColor, label, value, trend, trendColor, trendBg }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-icon-bg" style={{ backgroundColor: bgColor, color: color }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {trend && (
        <span className="trend-badge" style={{ backgroundColor: trendBg, color: trendColor }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> {trend}
        </span>
      )}
    </div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const ProgressBarCard = ({ icon, color, bgColor, label, value, percentage }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-icon-bg" style={{ backgroundColor: bgColor, color: color }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    <div className="stat-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="progress-container">
      <div className="progress-fill" style={{ backgroundColor: color, width: `${percentage}%` }}></div>
    </div>
    <div className="stat-value">{value}</div>
  </div>
);

const getMarkerIcon = (status) => {
  let color = 'var(--error)'; // open
  if (status === 'resolved') color = '#059669';
  if (status === 'in_progress') color = '#D97706';
  
  return L.divIcon({
    className: 'custom-status-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // null = no geo filter (GPS not yet acquired)
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
          setUserLocation(null); // No geo filter — show all issues
          setLocationFetched(true);
        }
      );
    } else {
      setUserLocation(null); // No geo filter — show all issues
      setLocationFetched(true);
    }
  }, []);

  useEffect(() => {
    if (!locationFetched) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Only add geo params if we have a real GPS location
        const queryParams = userLocation
          ? `lat=${userLocation[0]}&lng=${userLocation[1]}&dist=50000`
          : ''; // no geo filter when GPS is unavailable

        const [analyticsRes, issuesRes] = await Promise.all([
          apiClient.get(`/analytics${queryParams ? '?' + queryParams : ''}`),
          apiClient.get(`/issues?limit=50${queryParams ? '&' + queryParams : ''}`)
        ]);
        setAnalytics(analyticsRes.data);
        const fetchedIssues = issuesRes.data.issues || issuesRes.data;
        setAllIssues(fetchedIssues);
        setRecentIssues(fetchedIssues.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locationFetched, userLocation]);

  if (loading) {
    return <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading Dashboard...</div>;
  }

  const { summary, categoryStats, statusStats } = analytics || {};
  const inProgressCount = statusStats?.find(s => s._id === 'in_progress')?.count || 0;

  return (
    <>
      {/* Greeting Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="register-title" style={{ fontSize: '28px' }}>Good morning, {user?.name?.split(' ')[0] || 'Citizen'} 👋</h2>
          <p className="register-subtitle">Local Feed • {locationFetched ? 'Based on live location' : 'Locating...'} • Last updated just now</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="login-button" style={{ backgroundColor: 'white', color: 'var(--on-surface-variant)', border: '1px solid var(--outline)', width: 'auto', padding: '0 16px', height: '40px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Download Report
          </button>
          <button className="login-button" style={{ width: 'auto', padding: '0 16px', height: '40px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/report-issue')}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Report Issue
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard 
          icon="report" 
          color="#2563EB" 
          bgColor="#EFF6FF" 
          label="Total Issues" 
          value={summary?.totalIssues?.toLocaleString() || '0'} 
          trend="12%" 
          trendColor="#059669" 
          trendBg="#ECFDF5" 
        />
        <ProgressBarCard 
          icon="check_circle" 
          color="#059669" 
          bgColor="#ECFDF5" 
          label="Resolved" 
          value={summary?.resolvedIssues?.toLocaleString() || '0'} 
          percentage={Math.round(summary?.resolutionRate || 0)} 
        />
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-bg" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <div className="stat-label">In Progress</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div className="stat-value">{inProgressCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Avg: 3.2 days</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-bg" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '4px 8px', borderRadius: '4px', border: '1px solid #EDE9FE' }}>
              {user?.role === 'authority' ? 'Authority official' : 'Silver Contributor'}
            </span>
          </div>
          <div className="stat-label">Civic Points</div>
          <div className="stat-value">{user?.points || 0} <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--on-surface-variant)' }}>pts</span></div>
        </div>
      </div>

      {/* Map and Recent Feed */}
      <div className="split-grid">
        <div className="card-frame">
          <div className="card-header">
            <h3 className="card-title">Local Issue Map</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="send-otp-btn" style={{ padding: '4px 12px', border: '1px solid var(--outline)', backgroundColor: 'var(--surface-container)' }}>All</button>
              <button className="send-otp-btn" style={{ padding: '4px 12px', border: '1px solid var(--outline-variant)', backgroundColor: 'transparent', color: 'var(--on-surface-variant)' }}>Pothole</button>
            </div>
          </div>
          <div className="map-placeholder" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            <MapContainer center={userLocation || [20.5937, 78.9629]} zoom={userLocation ? 13 : 5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapUpdater center={userLocation} />
              
              {/* User Location Indicator - only show if GPS available */}
              {userLocation && (
                <CircleMarker 
                  center={userLocation} 
                  radius={7} 
                  fillColor="#3b82f6" 
                  color="white" 
                  weight={2} 
                  fillOpacity={1} 
                >
                  <Popup><strong>You are here</strong></Popup>
                </CircleMarker>
              )}

              {allIssues.filter(i => i.location?.coordinates).map(issue => (
                <Marker 
                  key={issue._id} 
                  position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
                  icon={getMarkerIcon(issue.status)}
                >
                  <Popup>
                    <strong>{issue.title}</strong><br/>
                    <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Status: {issue.status}</span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 1000, backgroundColor: 'rgba(255,255,255,0.9)', padding: '12px', borderRadius: '8px', border: '1px solid var(--outline-variant)', fontSize: '12px', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--error)' }}></div> Open (Critical)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#D97706' }}></div> In Progress</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#059669' }}></div> Resolved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-frame">
          <div className="card-header">
            <h3 className="card-title">Recent Issues</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}>View All</button>
          </div>
          <div className="issue-list">
            {recentIssues.length > 0 ? recentIssues.map(issue => (
              <div className="issue-item" key={issue._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-mono)' }}>#{issue._id.slice(-6).toUpperCase()}</span>
                  <span className={`status-chip ${issue.status}`} style={{ 
                    backgroundColor: issue.status === 'resolved' ? '#ECFDF5' : issue.status === 'in_progress' ? '#FFFBEB' : 'var(--error-container)', 
                    color: issue.status === 'resolved' ? '#059669' : issue.status === 'in_progress' ? '#D97706' : 'var(--on-error-container)',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}>{issue.status}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 12px 0' }}>{issue.title}</h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span> {issue.location?.address || 'N/A'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span> {new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p>No recent issues</p>}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        <div className="card-frame" style={{ padding: '24px' }}>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Category Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {categoryStats && categoryStats.length > 0 ? categoryStats.map((cat, idx) => {
              const colors = ['var(--primary)', '#D97706', 'var(--secondary)', 'var(--outline)'];
              const percentage = summary?.totalIssues > 0 ? Math.round((cat.count / summary.totalIssues) * 100) : 0;
              return (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{cat._id}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--on-surface-variant)' }}>{percentage}%</span>
                  </div>
                  <div className="progress-container" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ backgroundColor: colors[idx % colors.length], width: `${percentage}%`, height: '8px' }}></div>
                  </div>
                </div>
              );
            }) : <p>No category data</p>}
          </div>
        </div>

        <div className="card-frame" style={{ padding: '24px' }}>
          <h3 className="card-title" style={{ marginBottom: '24px' }}>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="action-btn" onClick={() => navigate('/report-issue')}>
              <div className="action-icon" style={{ backgroundColor: 'rgba(33,81,218,0.1)', color: 'var(--primary)' }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Report Issue</span>
            </button>
            <button className="action-btn">
              <div className="action-icon" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined">map</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>View Map</span>
            </button>
            <button className="action-btn">
              <div className="action-icon" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined">forum</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Community</span>
            </button>
            <button className="action-btn">
              <div className="action-icon" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined">bar_chart</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
