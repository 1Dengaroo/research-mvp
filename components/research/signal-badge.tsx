const COLORS: Record<string, string> = {
  job_posting: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  funding: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  news: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  product_launch: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  other: 'bg-muted text-muted-foreground'
};

const LABELS: Record<string, string> = {
  job_posting: 'Job Posting',
  funding: 'Funding',
  news: 'News',
  product_launch: 'Product Launch',
  other: 'Signal'
};

export function SignalBadge({ type }: { type: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[type] || COLORS.other}`}
    >
      {LABELS[type] || type}
    </span>
  );
}
