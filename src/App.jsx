import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

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
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import MainDashboard from '@/pages/dashboard/MainDashboard';
import AddBusinessPage from '@/pages/dashboard/AddBusinessPage';
import OwnershipPage from '@/pages/dashboard/OwnershipPage';
import TrustScanPage from '@/pages/dashboard/TrustScanPage';
import PrivateReportPage from '@/pages/dashboard/PrivateReportPage';
import VerificationApplicationPage from '@/pages/dashboard/VerificationApplicationPage';
import BadgeSetupPage from '@/pages/dashboard/BadgeSetupPage';
import PublicPreviewPage from '@/pages/dashboard/PublicPreviewPage';
import BillingPage from '@/pages/dashboard/BillingPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminReviewQueue from '@/pages/admin/AdminReviewQueue';
import AdminScanLogs from '@/pages/admin/AdminScanLogs';
import AdminBadges from '@/pages/admin/AdminBadges';
import AdminReports from '@/pages/admin/AdminReports';
import AdminUsers from '@/pages/admin/AdminUsers';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

          {/* Onboarding wizard — also the default entry for new users */}
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route path="/start" element={<OnboardingWizard />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/home" element={<MainDashboard />} />
          <Route path="/dashboard/add-business" element={<AddBusinessPage />} />
          <Route path="/dashboard/ownership" element={<OwnershipPage />} />
          <Route path="/dashboard/scan" element={<TrustScanPage />} />
          <Route path="/dashboard/report" element={<PrivateReportPage />} />
          <Route path="/dashboard/apply" element={<VerificationApplicationPage />} />
          <Route path="/dashboard/badge" element={<BadgeSetupPage />} />
          <Route path="/dashboard/public-preview" element={<PublicPreviewPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reviews" element={<AdminReviewQueue />} />
          <Route path="/admin/scan-logs" element={<AdminScanLogs />} />
          <Route path="/admin/badges" element={<AdminBadges />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;