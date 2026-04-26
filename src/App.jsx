import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public pages
import HomePage from '@/pages/HomePage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import PricingPage from '@/pages/PricingPage';
import TrustStandardsPage from '@/pages/TrustStandardsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PublicVerifyPage from '@/pages/PublicVerifyPage';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

// Legal pages
import TermsPage from '@/pages/legal/TermsPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import DisclaimerPage from '@/pages/legal/DisclaimerPage';

// Onboarding wizard
import OnboardingWizard from '@/pages/onboarding/OnboardingWizard';

// Dashboard pages
import MainDashboard from '@/pages/dashboard/MainDashboard';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminReviewQueue from '@/pages/admin/AdminReviewQueue';
import AdminScanLogs from '@/pages/admin/AdminScanLogs';
import AdminBadges from '@/pages/admin/AdminBadges';
import AdminReports from '@/pages/admin/AdminReports';
import AdminUsers from '@/pages/admin/AdminUsers';

const loginRedirect = <Navigate to="/login" replace />;
const dashboardRedirect = (section) => <Navigate to={`/dashboard/home?section=${section}`} replace />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/trust-standards" element={<TrustStandardsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/verify/:businessId" element={<PublicVerifyPage />} />

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
            {/* Onboarding wizard, also the default entry for new users */}
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="/start" element={<OnboardingWizard />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
            <Route path="/dashboard/home" element={<MainDashboard />} />
            <Route path="/dashboard/add-business" element={dashboardRedirect('websites')} />
            <Route path="/dashboard/ownership" element={dashboardRedirect('websites')} />
            <Route path="/dashboard/scan" element={dashboardRedirect('report')} />
            <Route path="/dashboard/report" element={dashboardRedirect('report')} />
            <Route path="/dashboard/apply" element={dashboardRedirect('report')} />
            <Route path="/dashboard/badge" element={dashboardRedirect('badge')} />
            <Route path="/dashboard/public-preview" element={dashboardRedirect('public')} />
            <Route path="/dashboard/billing" element={dashboardRedirect('billing')} />
            <Route path="/dashboard/settings" element={dashboardRedirect('settings')} />

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
