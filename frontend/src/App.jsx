import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CommunityFeedPage from './pages/CommunityFeed/CommunityFeedPage';
import ReportIssuePage from './pages/ReportIssue/ReportIssuePage';
import GovernmentProjectsPage from './pages/GovernmentProjects/GovernmentProjectsPage';
import CivicAuthorityPage from './pages/CivicAuthority/CivicAuthorityPage';
import AuthorityDashboardPage from './pages/AuthorityDashboard/AuthorityDashboardPage';
import UserProfilePage from './pages/UserProfile/UserProfilePage';
import WardAnalyticsPage from './pages/WardAnalytics/WardAnalyticsPage';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Main App Layout Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/community" element={<CommunityFeedPage />} />
            <Route path="/projects" element={<GovernmentProjectsPage />} />
            <Route path="/authority" element={<CivicAuthorityPage />} />
            <Route path="/authority-portal" element={<AuthorityDashboardPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/analytics" element={<WardAnalyticsPage />} />
          </Route>
          
          {/* Solo Routes (No Sidebar, Protected) */}
          <Route path="/report-issue" element={<ReportIssuePage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
