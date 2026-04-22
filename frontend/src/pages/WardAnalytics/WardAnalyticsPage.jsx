import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import './WardAnalyticsPage.css';

const WardAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await apiClient.get('/analytics');
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading analytics...</div>;

  const totalIssues = stats?.totalIssues || 0;
  const categories = stats?.categories || {};

  return (
    <div className="analytics-wrapper">
      {/* Page Header */}
      <div className="analytics-header">
        <div>
          <h1 className="register-title" style={{ fontSize: '32px', marginBottom: '4px' }}>Ward Analytics</h1>
          <p className="register-subtitle" style={{ fontSize: '18px' }}>Performance and issue tracking for Kothrud, Pune.</p>
        </div>
        <div className="analytics-filters">
          <div className="custom-select-wrapper">
            <select className="analytics-select">
              <option>All Areas</option>
              <option>Sector 1</option>
              <option>Sector 2</option>
            </select>
            <span className="material-symbols-outlined select-icon">expand_more</span>
          </div>
          <div className="custom-select-wrapper">
            <select className="analytics-select">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
            <span className="material-symbols-outlined select-icon">calendar_month</span>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <section className="analytics-section heatmap-section">
        <div className="section-card-header">
          <h3 className="card-title">Issue Density Heatmap — Kothrud, Pune</h3>
          <div className="heatmap-legend">
            <span>LOW</span>
            <div className="legend-gradient"></div>
            <span>HIGH</span>
          </div>
        </div>
        <div className="heatmap-canvas">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxU4_bniwTPCMG7wfP4-9QYn_Mds00lZK0M-V9JCvxpW5giz5dDe30Yjp5TUb680l5B4Y_IK_19gCVy58zHiItZcLcAejuP9rpaD6XpWwpN_x4VluusTcarzu1OCgMuTqUdJ_AkH4XW5K3AT8WPqsyqsN9YCpl_eRuH20fjPcU-unnUEU_LiyxpsgedSGywyxsC2sC8N9zEsi1FxGOYZ1HlYxVvc46AsCSvumlS9GMOsLbNVxTKWT0InVeZCojChehRkak9SjRowQ" 
            alt="Map Heatmap" 
            className="heatmap-img"
          />
          {/* Animated Markers for visual pop */}
          <div className="pulse-marker p1"></div>
          <div className="pulse-marker p2"></div>
          <div className="pulse-marker p3"></div>
        </div>
      </section>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Category Breakdown */}
        <div className="analytics-card chart-card">
          <h4 className="card-title">Category Breakdown</h4>
          <div className="donut-chart-container">
            <div className="donut-chart">
              <div className="donut-center">
                <span className="donut-label">Total</span>
                <span className="donut-value">{totalIssues}</span>
              </div>
            </div>
            <div className="chart-legend-list">
              {Object.entries(categories).map(([cat, count]) => {
                const perc = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                return (
                  <div key={cat} className="legend-item">
                    <div className="dot" style={{ backgroundColor: 
                      cat === 'Pothole' ? 'var(--primary)' : 
                      cat === 'Garbage' ? '#006948' : 
                      cat === 'Streetlight' ? '#eab308' : 'var(--secondary)'
                    }}></div>
                    <span>{cat}</span>
                    <span className="perc">{perc}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trends Chart */}
        <div className="analytics-card chart-card trends-card">
          <div className="section-card-header no-border">
            <h4 className="card-title">Issues Reported vs Resolved</h4>
            <div className="trend-labels">
              <div className="trend-label-item"><div className="line red"></div> Reported</div>
              <div className="trend-label-item"><div className="line green"></div> Resolved</div>
            </div>
          </div>
          <div className="line-chart-canvas">
            <svg viewBox="0 0 100 40" className="trend-svg">
              {/* Grid Lines */}
              <line x1="0" y1="0" x2="100" y2="0" stroke="var(--outline-variant)" strokeWidth="0.1" />
              <line x1="0" y1="10" x2="100" y2="10" stroke="var(--outline-variant)" strokeWidth="0.1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--outline-variant)" strokeWidth="0.1" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="var(--outline-variant)" strokeWidth="0.1" />
              
              {/* Reported Line */}
              <path d="M0,35 L10,30 L20,15 L30,22 L40,10 L50,18 L60,5 L70,12 L80,2 L90,8 L100,0" fill="none" stroke="var(--error)" strokeWidth="0.8" />
              {/* Resolved Line */}
              <path d="M0,38 L10,35 L20,30 L30,28 L40,24 L50,20 L60,18 L70,16 L80,12 L90,10 L100,5" fill="none" stroke="#006948" strokeWidth="0.8" />
            </svg>
            <div className="chart-x-axis">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Area Performance */}
      <section className="sub-area-section">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Sub-Area Performance</h3>
        <div className="performance-grid">
          <AreaPerfCard name="Bhusari Colony" open={42} rate={88} trend="up" />
          <AreaPerfCard name="Mayur Colony" open={156} rate={62} trend="down" />
          <AreaPerfCard name="Dahanukar Colony" open={28} rate={94} trend="up" />
          <AreaPerfCard name="Ideal Colony" open={89} rate={75} trend="flat" />
        </div>
      </section>
    </div>
  );
};

const AreaPerfCard = ({ name, open, rate, trend }) => (
  <div className="area-perf-card">
    <h5 className="area-name">{name}</h5>
    <div className="area-metrics">
      <div className="area-metric-item">
        <span className="metric-label">OPEN ISSUES</span>
        <div className="metric-value-large">{open}</div>
      </div>
      <div className="area-metric-item">
        <span className="metric-label">RESOLUTION RATE</span>
        <div className="metric-value-large" style={{ color: rate < 70 ? 'var(--error)' : '#006948' }}>
          {rate}%
          <span className="material-symbols-outlined trend-arrow">
            {trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default WardAnalyticsPage;
