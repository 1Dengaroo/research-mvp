export interface ICPCriteria {
  description: string;
  industry_keywords: string[];
  min_employees: number | null;
  max_employees: number | null;
  min_funding_amount: number | null;
  funding_stages: string[];
  hiring_signals: string[];
  tech_keywords: string[];
  company_examples: string[];
  locations: string[];
}

export interface SavedICP {
  id: string;
  user_id: string;
  name: string;
  icp: ICPCriteria;
  created_at: string;
  updated_at: string;
}
