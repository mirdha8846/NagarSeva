import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './ReportIssuePage.css';

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [locationData, setLocationData] = useState({
    lat: 18.5204, // default to Pune
    lng: 73.8567,
    loading: false,
    error: null
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationData(prev => ({ ...prev, error: 'Geolocation is not supported by your browser' }));
      return;
    }
    
    setLocationData(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null
        });
        setFormData(prev => ({ ...prev, location: 'Current GPS Coordinates' }));
      },
      (error) => {
        setLocationData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to access GPS. Please allow location permissions.' 
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-acquire GPS on mount so it's ready before step 2
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    // Re-try if still on default and user reached step 2
    if (currentStep === 2 && !locationData.loading && !locationData.error && locationData.lat === 18.5204) {
      getLocation();
    }
  }, [currentStep]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'High',
    description: '',
    location: 'Ward 42, Pune'
  });

  const categories = [
    { id: 'road', name: 'Pothole', icon: 'road' },
    { id: 'delete', name: 'Garbage', icon: 'delete' },
    { id: 'lightbulb', name: 'Streetlight', icon: 'lightbulb' },
    { id: 'water_drop', name: 'Drainage', icon: 'water_drop' },
    { id: 'park', name: 'Parks', icon: 'park' },
    { id: 'warning', name: 'Road Damage', icon: 'warning' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const selectCategory = (name) => {
    setFormData(prev => ({ ...prev, category: name }));
  };

  const selectPriority = (level) => {
    setFormData(prev => ({ ...prev, priority: level }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      alert('Please fill in the title, category, and description.');
      return;
    }

    if (isNaN(locationData.lat) || isNaN(locationData.lng) || locationData.error) {
      alert('GPS location not available. Please go back to Step 2 and allow location access.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('priority', formData.priority.toLowerCase());
      data.append('longitude', locationData.lng.toString());
      data.append('latitude', locationData.lat.toString());

      images.forEach(img => {
        data.append('images', img);
      });

      await apiClient.post('/issues', data);

      alert('Issue reported successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error reporting issue:', error);
      const msg = error.response?.data?.message || 'Failed to report issue. Please try again.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="report-container">
      <header className="report-header">
        <div>
          <h1>Report an Issue</h1>
          <p className="register-subtitle">Provide details to help us resolve the civic problem.</p>
        </div>
        <button className="cancel-btn" onClick={() => navigate('/dashboard')}>
          <span className="material-symbols-outlined">close</span>
          <span>CANCEL</span>
        </button>
      </header>

      <div className="report-layout">
        {/* Left: Form */}
        <div className="report-form-section">
          {/* Stepper */}
          <div className="stepper">
            <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-label">Details</span>
            </div>
            <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Location</span>
            </div>
            <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Review</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="report-card">
            {/* Step 1: Details */}
            {currentStep === 1 && (
              <>
                <div>
                  <label className="form-label">EVIDENCE (OPTIONAL)</label>
                  <div className="upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                    <input 
                      type="file" 
                      id="fileInput" 
                      multiple 
                      hidden 
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#94a3b8' }}>cloud_upload</span>
                    <span style={{ fontSize: '14px', margin: '8px 0' }}>Click to upload or drag and drop</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                  </div>
                  {previews.length > 0 && (
                    <div className="preview-thumbnails" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      {previews.map((src, i) => (
                        <img key={i} src={src} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">TITLE</label>
                  <input 
                    type="text" 
                    name="title"
                    className="login-input" 
                    placeholder="e.g. Large pothole on Main St." 
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="form-label">CATEGORY</label>
                  <div className="category-grid">
                    {categories.map(cat => (
                      <button 
                        key={cat.id} 
                        className={`category-btn ${formData.category === cat.name ? 'active' : ''}`}
                        onClick={() => selectCategory(cat.name)}
                      >
                        <span className="material-symbols-outlined">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">PRIORITY LEVEL</label>
                  <div className="priority-grid">
                    {['Low', 'Medium', 'High', 'Urgent'].map(prio => (
                      <button 
                        key={prio} 
                        className={`priority-btn ${formData.priority === prio ? 'active' : ''} ${prio === 'Urgent' ? 'urgent' : ''}`}
                        onClick={() => selectPriority(prio)}
                      >
                        {prio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">DESCRIPTION</label>
                  <textarea 
                    name="description"
                    className="login-input" 
                    style={{ height: '120px', padding: '12px', resize: 'none' }} 
                    placeholder="Provide more details about the issue..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
               <div style={{ padding: '20px', textAlign: 'center' }}>
                 <h3>Location</h3>
                 
                 {locationData.loading ? (
                   <div style={{ padding: '40px' }}>
                     <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>refresh</span>
                     <p>Acquiring real-time GPS coordinates...</p>
                   </div>
                 ) : locationData.error ? (
                   <div style={{ padding: '40px', color: 'var(--error)' }}>
                     <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>location_disabled</span>
                     <p>{locationData.error}</p>
                     <button className="outline-btn" style={{ marginTop: '16px' }} onClick={getLocation}>Retry GPS</button>
                   </div>
                 ) : (
                   <>
                     <p>Using precise GPS location: <strong>{formData.location}</strong></p>
                     <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                       Lat: {locationData.lat.toFixed(4)}, Lng: {locationData.lng.toFixed(4)}
                     </p>
                     <div style={{ background: '#f1f5f9', height: '250px', borderRadius: '8px', overflow: 'hidden', marginTop: '20px', border: '1px solid var(--outline-variant)' }}>
                       <iframe 
                         width="100%" 
                         height="100%" 
                         frameBorder="0" 
                         scrolling="no" 
                         marginHeight="0" 
                         marginWidth="0" 
                         src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationData.lng-0.005},${locationData.lat-0.005},${locationData.lng+0.005},${locationData.lat+0.005}&layer=mapnik&marker=${locationData.lat},${locationData.lng}`}
                         style={{ border: 'none' }}
                       ></iframe>
                     </div>
                   </>
                 )}
               </div>
            )}

            {currentStep === 3 && (
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>Final Review</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Priority:</strong> {formData.priority}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            {currentStep > 1 && (
              <button className="login-button" style={{ width: 'auto', padding: '0 24px' }} onClick={() => setCurrentStep(prev => prev - 1)}>
                Back
              </button>
            )}
            <button 
              className="login-button" 
              disabled={loading}
              style={{ width: 'auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (currentStep < 3) setCurrentStep(currentStep + 1);
                else handleSubmit();
              }}
            >
              {loading ? 'Submitting...' : currentStep === 3 ? 'Submit Report' : 'Next Step'}
              {!loading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="report-preview-section">
          <div className="preview-sticky">
            <div className="preview-card">
              <div className="preview-header">
                <h3 className="card-title" style={{ fontSize: '18px' }}>Preview</h3>
                <span style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>How it will appear</span>
              </div>

              <div className="preview-inner-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="status-chip" style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--on-secondary-container)' }}>
                    {formData.category || 'Pending Category'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>ID: --</span>
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0' }}>{formData.title || 'Waiting for details...'}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                  <span>{formData.location}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--on-surface)', minHeight: '60px', opacity: formData.description ? 1 : 0.6 }}>
                  {formData.description || 'Description will appear here once entered.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--outline-variant)', paddingTop: '12px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>
                    </div>
                    <span>{user?.name || 'You'} (You)</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Today</span>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Uploading data...</div>
              ) : previews.length > 0 ? (
                <div className="preview-images" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '16px' }}>
                   {previews.slice(0, 4).map((src, i) => (
                     <img key={i} src={src} alt="Evidence" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                   ))}
                </div>
              ) : (
                <div className="preview-empty-image">
                  <span className="material-symbols-outlined">image</span>
                  <span style={{ fontSize: '14px' }}>No evidence uploaded yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReportIssuePage;
