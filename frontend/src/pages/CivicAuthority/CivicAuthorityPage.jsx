import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import './CivicAuthorityPage.css';

const CivicAuthorityPage = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const { data } = await apiClient.get('/auth/authority');
        setOfficers(data);
      } catch (error) {
        console.error('Error fetching authority members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorities();
  }, []);

  const departments = [
    { title: 'Water Supply', icon: 'water_drop', phone: '+91 20 2567-XXXX', extension: 'ext 104' },
    { title: 'Solid Waste', icon: 'delete_sweep', phone: '+91 20 2567-XXXX', extension: 'ext 201' },
    { title: 'Road Maintenance', icon: 'edit_road', phone: '+91 20 2567-XXXX', extension: 'ext 305' },
    { title: 'Electricity (MSEB)', icon: 'bolt', phone: '+91 20 2567-XXXX', extension: 'ext 442' },
    { title: 'Parks & Recreation', icon: 'park', phone: '+91 20 2567-XXXX', extension: 'ext 512' },
    { title: 'Birth/Death Reg.', icon: 'description', phone: '+91 20 2567-XXXX', extension: 'ext 001' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading authority directory...</div>;

  return (
    <div className="authority-container">
      <header className="authority-header">
        <h1>Civic Authority Directory</h1>
        <p>Know the officials responsible for your ward’s governance and administrative services.</p>
      </header>

      <div className="authority-grid">
        {officers.length > 0 ? officers.map((officer) => (
          <div key={officer._id} className="officer-card">
            <div className="officer-avatar">
              {officer.avatar ? (
                <img src={officer.avatar} alt={officer.name} />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </div>
            <h3 className="officer-name">{officer.name}</h3>
            <span className="officer-role">{officer.role?.toUpperCase() || 'OFFICIAL'}</span>
            <p className="officer-bio">
              {officer.bio || 'Dedicated to ensuring transparent governance and efficient administrative services for all citizens of Ward 42.'}
            </p>
            <div className="contact-row">
              <button className="contact-btn primary">Email Office</button>
              <button className="contact-btn secondary">Request Meeting</button>
            </div>
          </div>
        )) : <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.6 }}>No officers currently listed for this ward.</p>}
      </div>

      <div className="dept-section">
        <h2>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>help_center</span>
          Departmental Helplines
        </h2>
        <div className="dept-grid">
          {departments.map((dept, idx) => (
            <div key={idx} className="dept-card">
              <div className="dept-icon">
                <span className="material-symbols-outlined">{dept.icon}</span>
              </div>
              <span className="dept-title">{dept.title}</span>
              <div className="dept-contact">
                <div className="dept-phone">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                  {dept.phone}
                </div>
                <div className="dept-phone" style={{ fontSize: '12px', color: '#64748b' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call_received</span>
                  {dept.extension}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '64px', padding: '24px', border: '1px dashed var(--outline-variant)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>
          Cant find who you are looking for? <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse the full PMC Directory</a> or <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Report an administrative issue</a>.
        </p>
      </div>
    </div>
  );
};

export default CivicAuthorityPage;
