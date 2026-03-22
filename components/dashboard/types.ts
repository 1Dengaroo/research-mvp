export interface Funnel {
  sessions: number;
  companies_researched: number;
  companies_contacted: number;
  emails_sent: number;
}

export interface WeeklyEmail {
  week: string;
  count: number;
}

export interface Signal {
  type: string;
  count: number;
}

export interface UncontactedCompany {
  name: string;
  session_id: string;
  website: string | null;
  logo_url: string | null;
}
