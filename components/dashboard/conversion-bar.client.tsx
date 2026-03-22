'use client';

import type { Funnel } from '@/lib/types';

export function ConversionBar({ funnel }: { funnel: Funnel }) {
  if (funnel.companies_researched === 0) return null;

  const rate = Math.round((funnel.companies_contacted / funnel.companies_researched) * 100);
  const gap = funnel.companies_researched - funnel.companies_contacted;

  return (
    <div className="bg-primary/5 border-primary/10 rounded-(--card-radius) border px-4 py-3">
      <p className="text-sm">
        <span className="text-foreground font-medium">{rate}% contact rate</span>
        {gap > 0 && (
          <span className="text-muted-foreground">
            {' — '}
            {gap} {gap === 1 ? 'company' : 'companies'} researched but not yet contacted
          </span>
        )}
      </p>
    </div>
  );
}
