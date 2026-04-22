import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="reset-container">
      {/* Brand Anchor */}
      <div className="reset-brand">
        <span className="reset-brand-text">NagarSeva</span>
      </div>

      {/* Recovery Card */}
      <main className="reset-card">
        {/* Header Section */}
        <header className="reset-header">
          <h1 className="reset-title">Reset Password</h1>
          <p className="reset-subtitle">
            Enter your registered email address. We will send you instructions to securely reset your password.
          </p>
        </header>

        {/* Form & Messaging Section */}
        <div className="reset-content">
          {/* Success State Banner */}
          {submitted && (
            <div className="success-banner">
              <span className="material-symbols-outlined success-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="success-info">
                <span className="success-title">RECOVERY LINK DISPATCHED</span>
                <span className="success-text">
                  If an account matches the provided address, a secure link has been sent to your inbox. It will expire in 15 minutes.
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email_input">Registered Email</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon" style={{ fontSize: '20px' }}>
                  mail
                </span>
                <input
                  type="email"
                  id="email_input"
                  className="login-input"
                  placeholder="citizen@example.gov.uk"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button" style={{ height: '44px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Send Recovery Link
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </form>

          {/* Navigation Back */}
          <div className="reset-footer-nav">
            <Link to="/login" className="back-to-login">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>keyboard_backspace</span>
              Return to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Trust Anchor */}
      <div className="trust-anchor">
        <span className="trust-text">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
          Secure Civic Portal
        </span>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
