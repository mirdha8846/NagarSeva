import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* TopAppBar */}
      <header className="top-bar">
        <div className="brand">
          <span className="material-symbols-outlined brand-icon">account_balance</span>
          <span className="brand-name">NagarSeva</span>
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Sign In</Link>
        </nav>
        <div className="actions">
          <button className="help-button">Help</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="register-main">
        <div className="register-card">
          <div className="register-content">
            <div className="register-header">
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">Register to access digital civic services.</p>
            </div>

            <form className="register-form" onSubmit={handleSignup}>
              {error && <div className="error-alert" style={{ color: 'var(--error)', backgroundColor: 'var(--error-container)', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
              
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">FULL NAME</label>
                <input
                  type="text"
                  id="fullName"
                  className="login-input" style={{ paddingLeft: '12px' }}
                  placeholder="e.g. Jane Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">EMAIL ADDRESS</label>
                <input
                  type="email"
                  id="email"
                  className="login-input" style={{ paddingLeft: '12px' }}
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">PASSWORD</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    className="login-input" style={{ paddingLeft: '12px' }}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="password-hint">Must be at least 8 characters long.</p>
              </div>

              {/* Terms */}
              <div className="terms-group">
                <input type="checkbox" id="terms" required />
                <label className="register-subtitle" htmlFor="terms" style={{ marginLeft: '8px' }}>
                  I agree to the <a href="#" className="register-link">Terms of Service</a> and <a href="#" className="register-link">Privacy Policy</a>.
                </label>
              </div>

              {/* Actions */}
              <div style={{ paddingTop: '16px' }}>
                <button type="submit" className="login-button" style={{ height: '48px', fontSize: '16px' }} disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <p className="register-footer">
                  Already registered? <Link to="/login" className="register-link">Sign in instead</Link>
                </p>
              </div>
            </form>
          </div>

          <div className="secure-badge">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
            <span className="secure-badge-text">Secure Civic Network Registration</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <div className="copyright">© 2024 Civic Engagement Platform. Built for public transparency.</div>
        <nav className="footer-nav">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Accessibility Statement</a>
          <a href="#" className="footer-link">Cookie Policy</a>
        </nav>
      </footer>
    </div>
  );
};

export default RegisterPage;
