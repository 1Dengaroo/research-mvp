'use client';

import Link from 'next/link';
import { Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pipeline } from './pipeline.client';
import { WeeklyChart } from './weekly-chart.client';
import { SignalBreakdown } from './signal-breakdown.client';
import { UncontactedList } from './uncontacted-list.client';
import { ConversionBar } from './conversion-bar.client';
import { MAX_WIDTH } from '@/lib/layout';
import type { Funnel, WeeklyEmail, Signal, UncontactedCompany } from '@/lib/types';

interface DashboardPageProps {
  funnel: Funnel;
  weeklyEmails: WeeklyEmail[];
  topSignals: Signal[];
  uncontacted: UncontactedCompany[];
}

function EmptyDashboard() {
  return (
    <div className="border-border bg-card rounded-(--card-radius) border py-16 text-center">
      <p className="text-foreground mb-1 text-sm font-medium">No activity yet</p>
      <p className="text-muted-foreground mx-auto mb-5 max-w-xs text-sm">
        Start researching companies to see your pipeline stats here.
      </p>
      <Button asChild size="sm">
        <Link href="/research">
          <Search className="size-3.5" />
          Start Researching
        </Link>
      </Button>
    </div>
  );
}

export function DashboardPage({
  funnel,
  weeklyEmails,
  topSignals,
  uncontacted
}: DashboardPageProps) {
  const isEmpty = funnel.sessions === 0 && funnel.emails_sent === 0;

  return (
    <div className={`mx-auto ${MAX_WIDTH} px-4 py-10 md:px-6`}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-lg font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-xs">Your outreach pipeline at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/research"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors"
          >
            <Search className="size-3" />
            Research
          </Link>
          <Link
            href="/emails"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors"
          >
            <Mail className="size-3" />
            Emails
          </Link>
        </div>
      </div>

      {isEmpty ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-3">
          <Pipeline funnel={funnel} />

          <div className="grid gap-3 md:grid-cols-3">
            <WeeklyChart data={weeklyEmails} />
            <SignalBreakdown signals={topSignals} />
            <UncontactedList companies={uncontacted} />
          </div>

          <ConversionBar funnel={funnel} />
        </div>
      )}
    </div>
  );
}
