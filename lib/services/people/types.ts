export interface ApolloPersonPreview {
  apollo_person_id: string;
  first_name: string;
  last_name_obfuscated: string;
  title: string | null;
  organization_name: string;
  has_email: boolean;
  has_direct_phone: boolean;
  last_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  is_enriched?: boolean;
}

export interface PeopleSearchResult {
  company_name: string;
  apollo_org_id: string;
  ranked_people: ApolloPersonPreview[];
}
