import type {
  ICPCriteria,
  CompanyResult,
  ResearchStreamEvent,
  DiscoveredCompanyPreview
} from '@/lib/types';
import type { ICPParser, CompanyDiscovery, CompanyResearcher } from './interfaces';

import { claudeICPParser } from './ai';
import { parallelCompanyDiscovery } from './parallel';
import { claudeResearchAgent } from './research-agent';

export interface PipelineConfig {
  icpParser: ICPParser;
  companyDiscovery: CompanyDiscovery;
  companyResearcher: CompanyResearcher;
}

const defaultConfig: PipelineConfig = {
  icpParser: claudeICPParser,
  companyDiscovery: parallelCompanyDiscovery,
  companyResearcher: claudeResearchAgent
};

function buildLinkedInSearchUrl(name: string, companyName?: string): string {
  const keywords = companyName ? `${name} ${companyName}` : name;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}&origin=GLOBAL_SEARCH_HEADER`;
}

function filterRealContacts(
  contacts: { name: string; title: string; email: string | null; is_decision_maker: boolean }[],
  companyName: string
) {
  return contacts
    .filter((c) => {
      const name = c.name.trim();
      if (!name) return false;
      if (name.split(/\s+/).length < 2) return false;
      return !/^(VP|CTO|CEO|CFO|COO|Head|Director|Manager|Chief|President|SVP|EVP)\b/i.test(name);
    })
    .map((c) => ({
      name: c.name,
      title: c.title,
      linkedin_url: buildLinkedInSearchUrl(c.name, companyName),
      email: c.email || null,
      is_decision_maker: c.is_decision_maker
    }));
}

/**
 * Phase 1: Discover companies matching the ICP.
 * Returns candidates for user confirmation.
 */
export async function discoverCompanies(
  icp: ICPCriteria,
  send: (event: ResearchStreamEvent) => void,
  config: PipelineConfig = defaultConfig
): Promise<void> {
  send({ type: 'status', message: `Searching for companies matching: ${icp.description}` });
  const companies = await config.companyDiscovery.find(icp);

  if (companies.length === 0) {
    send({ type: 'status', message: 'No companies found matching your criteria.' });
    send({ type: 'candidates', data: [] });
    return;
  }

  const candidates: DiscoveredCompanyPreview[] = companies.map((c) => ({
    name: c.name,
    website: c.website,
    description: c.description
  }));

  send({ type: 'candidates', data: candidates });
}

/**
 * Phase 2: Deep-research confirmed companies.
 * Takes a list of company names the user approved.
 */
export async function researchConfirmedCompanies(
  companyNames: string[],
  icp: ICPCriteria,
  send: (event: ResearchStreamEvent) => void,
  config: PipelineConfig = defaultConfig
): Promise<void> {
  let completedCount = 0;

  const processCompany = async (companyName: string) => {
    try {
      const research = await config.companyResearcher.research(companyName, icp);

      const contacts = filterRealContacts(research.inferred_contacts, companyName);

      const result: CompanyResult = {
        company_name: companyName,
        industry: research.industry,
        funding_stage: research.funding_stage,
        amount_raised: research.amount_raised,
        website: null,
        linkedin_search_url: buildLinkedInSearchUrl(companyName),
        signals: research.signals,
        match_reason: research.match_reason,
        company_overview: research.company_overview,
        contacts,
        email_hook: research.email_hook,
        sources: research.sources
      };

      completedCount++;
      send({ type: 'company', data: result });
    } catch {
      send({ type: 'status', message: `Skipped ${companyName} due to an error.` });
    }
  };

  for (let i = 0; i < companyNames.length; i++) {
    send({
      type: 'status',
      message: `Researching ${companyNames[i]} (${i + 1}/${companyNames.length})...`
    });
    await processCompany(companyNames[i]);
  }
  send({ type: 'done', total: completedCount });
}
