import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import DashBadge from '@/pages/dashboard/sections/DashBadge';
import { useBizData } from '@/pages/dashboard/MainDashboard';

const SECTION_ROUTES = {
  billing: '/dashboard/billing',
  report: '/dashboard/report',
  badge: '/dashboard/badge',
  public: '/dashboard/public-preview',
};

export default function BadgeSetupPage() {
  const navigate = useNavigate();
  const biz = useBizData();
  const [status, setStatus] = useState('free');

  useEffect(() => {
    if (biz.dashboardStatus) {
      setStatus(biz.dashboardStatus);
      return;
    }

    if (biz.plan === 'pro') {
      setStatus('pro');
      return;
    }

    if (biz.plan === 'onetime') {
      setStatus('onetime');
    }
  }, [biz.dashboardStatus, biz.plan]);

  return (
    <DashboardLayout>
      <DashBadge
        biz={biz}
        status={status}
        setSection={(section) => navigate(SECTION_ROUTES[section] || '/dashboard/home')}
      />
    </DashboardLayout>
  );
}
