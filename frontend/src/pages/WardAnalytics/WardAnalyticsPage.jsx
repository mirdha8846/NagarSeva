import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WardAnalyticsPage.css';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13, { animate: true });
  }, [center, map]);
  return null;
};

const WardAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
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
          setUserLocation(null);
          setLocationFetched(true);
        }
      );
    } else {
      setUserLocation(null);
      setLocationFetched(true);
    }
  }, []);

  useEffect(() => {
    if (!locationFetched) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const queryParams = userLocation
          ? `lat=${userLocation[0]}&lng=${userLocation[1]}&dist=50000`
          : '';

        const [analyticsRes, issuesRes] = await Promise.all([
          apiClient.get(`/analytics${queryParams ? '?' + queryParams : ''}`),
          apiClient.get(`/issues?limit=100${queryParams ? '&' + queryParams : ''}`)
        ]);
        setStats(analyticsRes.data);
        setIssues(issuesRes.data.issues || issuesRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [locationFetched, userLocation]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontSize: '18px', color: 'var(--on-surface-variant)' }}>Analyzing civic data...</div>;

  const summary = stats?.summary || { totalIssues: 0, resolvedIssues: 0, resolutionRate: 0 };
  const categoryStats = stats?.categoryStats || [];
  const statusStats = stats?.statusStats || [];

  return (
    <div className="analytics-wrapper">
      {/* Page Header */}
      <div className="analytics-header">
        <div>
          <h1 className="register-title" style={{ fontSize: '32px', marginBottom: '4px' }}>Local Insights</h1>
          <p className="register-subtitle" style={{ fontSize: '18px' }}>
            {userLocation ? 'Live analytics for your current zone' : 'Global platform analytics'}
          </p>
        </div>
        <div className="analytics-filters">
           <div className="custom-select-wrapper">
            <div className="analytics-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)', borderRadius: '100px', fontSize: '14px', fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>my_location</span>
              Live Area
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="analytics-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 600, marginBottom: '8px' }}>TOTAL REPORTS</div>
          <div style={{ fontSize: '36px', fontWeight: 700 }}>{summary.totalIssues}</div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> 8% from last month
          </div>
        </div>
        <div className="analytics-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 600, marginBottom: '8px' }}>RESOLUTION RATE</div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: '#059669' }}>{Math.round(summary.resolutionRate)}%</div>
          <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>{summary.resolvedIssues} issues fixed</div>
        </div>
        <div className="analytics-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 600, marginBottom: '8px' }}>ACTIVE STATUS</div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: '#D97706' }}>
            {statusStats.find(s => s._id === 'in_progress')?.count || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>Issues being worked on</div>
        </div>
      </div>

      {/* Heatmap Section */}
      <section className="analytics-section heatmap-section" style={{ marginBottom: '32px' }}>
        <div className="section-card-header">
          <h3 className="card-title">Problem Density Heatmap</h3>
          <div className="heatmap-legend">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--error)', opacity: 0.7 }}></div>
              <span style={{ fontSize: '12px' }}>Issue Hotspots</span>
            </div>
          </div>
        </div>
        <div className="heatmap-canvas" style={{ padding: 0, overflow: 'hidden', height: '450px' }}>
          <MapContainer center={userLocation || [20.5937, 78.9629]} zoom={userLocation ? 14 : 5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <MapUpdater center={userLocation} />
            
            {issues.filter(i => i.location?.coordinates).map(issue => (
              <CircleMarker 
                key={issue._id} 
                center={[issue.location.coordinates[1], issue.location.coordinates[0]]} 
                radius={12}
                fillColor={issue.status === 'resolved' ? '#10B981' : issue.status === 'in_progress' ? '#F59E0B' : '#EF4444'}
                color="white"
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div style={{ padding: '4px', fontWeight: 600 }}>
                    {issue.title}<br/>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>{issue.category} • {issue.status}</span>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Category Breakdown */}
        <div className="analytics-card chart-card">
          <h4 className="card-title">Issue Distribution</h4>
          <div className="donut-chart-container">
            <div className="donut-chart">
              <div className="donut-center">
                <span className="donut-label">Total</span>
                <span className="donut-value">{summary.totalIssues}</span>
              </div>
            </div>
            <div className="chart-legend-list">
              {categoryStats.map((cat, idx) => {
                const perc = summary.totalIssues > 0 ? Math.round((cat.count / summary.totalIssues) * 100) : 0;
                const colors = ['#2563EB', '#D97706', '#059669', '#7C3AED', '#DB2777'];
                return (
                  <div key={cat._id} className="legend-item">
                    <div className="dot" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                    <span style={{ textTransform: 'capitalize' }}>{cat._id}</span>
                    <span className="perc">{perc}%</span>
                  </div>
                );
              })}
              {categoryStats.length === 0 && <div style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>No category data available</div>}
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="analytics-card chart-card">
          <h4 className="card-title">Resolution Progress</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
            {statusStats.map(status => {
              const perc = summary.totalIssues > 0 ? Math.round((status.count / summary.totalIssues) * 100) : 0;
              const color = status._id === 'resolved' ? '#10B981' : status._id === 'in_progress' ? '#F59E0B' : '#EF4444';
              return (
                <div key={status._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>
                    <span style={{ textTransform: 'uppercase' }}>{status._id.replace('_', ' ')}</span>
                    <span>{status.count} Issues</span>
                  </div>
                  <div className="progress-container" style={{ height: '10px', backgroundColor: 'var(--surface-container-highest)' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        backgroundColor: color, 
                        width: `${perc}%`,
                        height: '100%',
                        borderRadius: '10px'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardAnalyticsPage;
