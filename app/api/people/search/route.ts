import { NextRequest } from 'next/server';
import { apolloPeopleSearch } from '@/lib/services/apollo-people';
import { rankPeopleForCompany } from '@/lib/services/people-ranking';
import type { ICPCriteria, PeopleSearchResult } from '@/lib/types';

function isICPCriteria(value: unknown): value is ICPCriteria {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.description === 'string' && Array.isArray(obj.industry_keywords);
}

interface CompanyEntry {
  name: string;
  apollo_org_id: string;
}

function isCompanyEntryArray(value: unknown): value is CompanyEntry[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).name === 'string' &&
      typeof (item as Record<string, unknown>).apollo_org_id === 'string'
  );
}

export async function POST(req: NextRequest) {
  const body: Record<string, unknown> = await req.json();

  const orgIds = Array.isArray(body.org_ids) ? (body.org_ids as string[]) : undefined;
  const icp = isICPCriteria(body.icp) ? body.icp : undefined;
  const companies = isCompanyEntryArray(body.companies) ? body.companies : undefined;

  if (!orgIds || !icp || !companies) {
    return Response.json({ error: 'org_ids, icp, and companies are required' }, { status: 400 });
  }

  if (!process.env.APOLLO_API_KEY) {
    return Response.json({ error: 'APOLLO_API_KEY is not set' }, { status: 500 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
  }

  try {
    const peopleByOrg = await apolloPeopleSearch(orgIds);

    // Build org name → company entry lookup
    const orgIdToCompany = new Map<string, CompanyEntry>();
    for (const company of companies) {
      orgIdToCompany.set(company.apollo_org_id, company);
    }

    // Match people to companies by organization_name and rank
    const results: PeopleSearchResult[] = [];

    for (const company of companies) {
      // Apollo returns people grouped by org name — find matching group
      const people = peopleByOrg.get(company.name) ?? [];

      if (people.length === 0) {
        results.push({
          company_name: company.name,
          apollo_org_id: company.apollo_org_id,
          ranked_people: []
        });
        continue;
      }

      const ranked = await rankPeopleForCompany(people, icp, company.name);

      results.push({
        company_name: company.name,
        apollo_org_id: company.apollo_org_id,
        ranked_people: ranked
      });
    }

    return Response.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'People search failed';
    console.error('[People Search]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
