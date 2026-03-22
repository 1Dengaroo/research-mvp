import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/supabase/server';
import { fetchDashboardData } from '@/lib/services/dashboard';
import { DashboardPage } from '@/components/dashboard/dashboard-page.client';

export default async function Dashboard() {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect('/');

  const data = await fetchDashboardData(supabase, user.id);

  return (
    <DashboardPage
      funnel={data.funnel}
      weeklyEmails={data.weeklyEmails}
      topSignals={data.topSignals}
      uncontacted={data.uncontacted}
    />
  );
}
