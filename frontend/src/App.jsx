import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SkillGapCopilot from './components/SkillGapCopilot';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import TargetRolePage from './pages/TargetRolePage';
import SkillGapAnalysisPage from './pages/SkillGapAnalysisPage';
import JobReadinessPage from './pages/JobReadinessPage';
import AtsCompatibilityPage from './pages/AtsCompatibilityPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProjectGeneratorPage from './pages/ProjectGeneratorPage';
import MockInterviewPage from './pages/MockInterviewPage';

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div style={styles.guestWrapper}>
        <Navbar />
        <main style={styles.guestMain}>{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.authWrapper}>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <SkillGapCopilot />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <ResumeUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/target-role"
          element={
            <ProtectedRoute>
              <TargetRolePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <SkillGapAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-readiness"
          element={
            <ProtectedRoute>
              <JobReadinessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats-compatibility"
          element={
            <ProtectedRoute>
              <AtsCompatibilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-roadmap"
          element={
            <ProtectedRoute>
              <CareerRoadmapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-generator"
          element={
            <ProtectedRoute>
              <ProjectGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <MockInterviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress-tracking"
          element={
            <ProtectedRoute>
              <ProgressTrackingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminRequired>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};

const styles = {
  guestWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#F7F4EA',
  },
  guestMain: {
    flex: 1,
  },
  authWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#F7F4EA',
  },
};

export default App;
