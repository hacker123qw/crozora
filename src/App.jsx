import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

// Legal pages
import TermsPage from '@/pages/legal/TermsPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import DisclaimerPage from '@/pages/legal/DisclaimerPage';

// Onboarding
import OnboardingWizard from '@/pages/onboarding/OnboardingWizard';

// Dashboard — Crozora ecosystem
import EcosystemFeed from '@/pages/dashboard/EcosystemFeed';
import BuilderProfilePage from '@/pages/dashboard/BuilderProfilePage';
import ProjectsPage from '@/pages/dashboard/ProjectsPage';
import DiscoverPage from '@/pages/dashboard/DiscoverPage';
import BuildRoomsPage from '@/pages/dashboard/BuildRoomsPage';
import IdeasPage from '@/pages/dashboard/IdeasPage';
import AICoBuilderPage from '@/pages/dashboard/AICoBuilderPage';
import MarketplacePage from '@/pages/dashboard/MarketplacePage';
import SettingsPage from '@/pages/dashboard/SettingsPage';

// Admin (internal, not exposed in nav)
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminReviewQueue from '@/pages/admin/AdminReviewQueue';
import AdminScanLogs from '@/pages/admin/AdminScanLogs';
import AdminBadges from '@/pages/admin/AdminBadges';
import AdminReports from '@/pages/admin/AdminReports';
import AdminUsers from '@/pages/admin/AdminUsers';

const loginRedirect = <Navigate to="/login" replace />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Legal */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          <Route element={<ProtectedRoute unauthenticatedElement={loginRedirect} />}>
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="/start" element={<OnboardingWizard />} />

            {/* Ecosystem dashboard */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/feed" replace />} />
            <Route path="/dashboard/feed" element={<EcosystemFeed />} />
            <Route path="/dashboard/profile" element={<BuilderProfilePage />} />
            <Route path="/dashboard/projects" element={<ProjectsPage />} />
            <Route path="/dashboard/discover" element={<DiscoverPage />} />
            <Route path="/dashboard/build-rooms" element={<BuildRoomsPage />} />
            <Route path="/dashboard/ideas" element={<IdeasPage />} />
            <Route path="/dashboard/ai" element={<AICoBuilderPage />} />
            <Route path="/dashboard/marketplace" element={<MarketplacePage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<AdminReviewQueue />} />
            <Route path="/admin/scan-logs" element={<AdminScanLogs />} />
            <Route path="/admin/badges" element={<AdminBadges />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
