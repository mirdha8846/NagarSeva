import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <main className="login-card">
        {/* Header Section */}
        <header className="login-header">
          <div className="login-logo" aria-hidden="true">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <h1 className="login-title">NagarSeva</h1>
          <p className="login-subtitle">Sign in to access civic services</p>
        </header>

        {/* Form Section */}
        <form className="login-form" onSubmit={handleSignIn}>
          {error && <div className="error-alert" style={{ color: 'var(--error)', backgroundColor: 'var(--error-container)', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon" style={{ fontSize: '18px' }}>
                mail
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="login-input"
                placeholder="citizen@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon" style={{ fontSize: '18px' }}>
                lock
              </span>
              <input
                type="password"
                id="password"
                name="password"
                className="login-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Meta Options */}
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember-me" name="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Link to="/reset-password" name="forgot-password-link" className="forgot-password">Forgot Password?</Link>
          </div>

          {/* Primary Action */}
          <div style={{ paddingTop: '8px' }}>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">Or continue with</span>
        </div>

        {/* Secondary Action */}
        <button type="button" className="google-button">
          <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Sign in with Google
        </button>

        {/* Footer Link */}
        <footer className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" name="register-link" className="register-link">Register here</Link>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
