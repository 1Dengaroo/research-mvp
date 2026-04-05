import type { ICPCriteria } from '../icp/types';

export interface SourceLink {
  title: string;
  url: string;
}

export interface CompanySignal {
  type: 'job_posting' | 'news' | 'funding' | 'product_launch' | 'other';
  title: string;
  key_phrases: string[];
  source_url?: string;
}

export interface TargetContact {
  name: string;
  title: string;
  linkedin_url: string;
  email: string | null;
  is_decision_maker: boolean;
}

export interface CompanyResult {
  company_name: string;
  industry: string;
  funding_stage: string;
  amount_raised: string;
  website: string | null;
  linkedin_url: string;
  logo_url: string;
  signals: CompanySignal[];
  match_reason: string;
  company_overview: string;
  contacts: TargetContact[];
  sources: {
    jobs: SourceLink[];
    funding: SourceLink[];
    news: SourceLink[];
  };
}

export interface DiscoveredCompanyPreview {
  name: string;
  website?: string;
  description?: string;
  linkedin_url?: string;
  logo_url?: string;
  apollo_org_id?: string;
  location?: string;
}

export type ResearchStreamEvent =
  | { type: 'status'; message: string }
  | { type: 'icp'; data: ICPCriteria }
  | { type: 'candidates'; data: DiscoveredCompanyPreview[] }
  | { type: 'company'; data: CompanyResult }
  | { type: 'done'; total: number }
  | { type: 'error'; message: string };
