import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { Mail, Phone, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import './CivicAuthorityPage.css';

const CivicAuthorityPage = () => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const res = await apiClient.get('/auth/authority');
        setAuthorities(res.data);
      } catch (error) {
        console.error('Error fetching authorities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorities();
  }, []);

  if (loading) return <div className="loading-state">Identifying responsible officials...</div>;

  return (
    <div className="authority-page-container">
      <div className="authority-header">
        <h1 className="register-title">Civic Authorities</h1>
        <p className="register-subtitle">Meet the officials responsible for maintaining your city's infrastructure and services.</p>
      </div>

      <div className="authority-grid">
        {authorities.map((official) => (
          <div key={official._id} className="official-card">
            <div className="official-card-top">
              <div className="official-avatar-large">
                {official.name.charAt(0)}
              </div>
              <div className="official-badge">
                <ShieldCheck size={14} />
                Verified Official
              </div>
            </div>
            
            <div className="official-info">
              <h3 className="official-name">{official.name}</h3>
              <p className="official-role" style={{ textTransform: 'capitalize' }}>{official.role}</p>
              
              <div className="official-contact-list">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{official.email}</span>
                </div>
                {official.phone && (
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{official.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {authorities.length === 0 && (
          <div className="empty-authorities">
            <p>No verified officials listed yet. The admin is currently onboarding the civic team.</p>
          </div>
        )}
      </div>

      <div className="transparency-note">
        <ShieldCheck size={20} color="var(--primary)" />
        <p>All officials listed here are verified members of the Municipal Authority. Citizens can connect with them for urgent escalations or feedback.</p>
      </div>
    </div>
  );
};

export default CivicAuthorityPage;
