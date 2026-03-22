import type { SupabaseClient } from '@supabase/supabase-js';
import type { Funnel, WeeklyEmail, Signal, UncontactedCompany } from '@/lib/types';
import {
  getSessionsForDashboard,
  getSentEmailsForDashboard,
  getContactedCompaniesForDashboard
} from '@/lib/supabase/queries';

interface DashboardData {
  funnel: Funnel;
  weeklyEmails: WeeklyEmail[];
  topSignals: Signal[];
  uncontacted: UncontactedCompany[];
}

export async function fetchDashboardData(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardData> {
  const [sessionsRes, emailsRes, contactedRes] = await Promise.all([
    getSessionsForDashboard(supabase, userId),
    getSentEmailsForDashboard(supabase, userId),
    getContactedCompaniesForDashboard(supabase, userId)
  ]);

  const sessions = sessionsRes.data ?? [];
  const emails = emailsRes.data ?? [];
  const contacted = contactedRes.data ?? [];

  const contactedSet = new Set(contacted.map((c) => c.company_name));

  let companiesResearched = 0;
  const signalCounts: Record<string, number> = {};
  const uncontacted: UncontactedCompany[] = [];
  const seenUncontacted = new Set<string>();

  for (const session of sessions) {
    const results = Array.isArray(session.results) ? session.results : [];
    const candidates = Array.isArray(session.candidates) ? session.candidates : [];
    companiesResearched += results.length;

    const candidateMap = new Map<string, { website?: string; logo_url?: string }>();
    for (const c of candidates) {
      const cn = c as { name?: string; website?: string; logo_url?: string };
      if (cn.name) candidateMap.set(cn.name, cn);
    }

    for (const result of results) {
      const r = result as {
        company_name?: string;
        website?: string;
        logo_url?: string;
        signals?: { type: string }[];
      };

      if (Array.isArray(r.signals)) {
        for (const signal of r.signals) {
          signalCounts[signal.type] = (signalCounts[signal.type] ?? 0) + 1;
        }
      }

      if (
        r.company_name &&
        !contactedSet.has(r.company_name) &&
        !seenUncontacted.has(r.company_name)
      ) {
        seenUncontacted.add(r.company_name);
        const candidate = candidateMap.get(r.company_name);
        uncontacted.push({
          name: r.company_name,
          session_id: session.id,
          website: r.website ?? candidate?.website ?? null,
          logo_url: r.logo_url ?? candidate?.logo_url ?? null
        });
      }
    }
  }

  const emailsSent = emails.filter((e) => e.status === 'sent').length;

  // Weekly activity (last 4 weeks)
  const now = new Date();
  const weeklyEmails: WeeklyEmail[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const count = emails.filter((e) => {
      const d = new Date(e.created_at);
      return e.status === 'sent' && d >= weekStart && d < weekEnd;
    }).length;

    weeklyEmails.push({
      week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    });
  }

  const topSignals = Object.entries(signalCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  return {
    funnel: {
      sessions: sessions.length,
      companies_researched: companiesResearched,
      companies_contacted: contactedSet.size,
      emails_sent: emailsSent
    },
    weeklyEmails,
    topSignals,
    uncontacted: uncontacted.slice(0, 10)
  };
}
