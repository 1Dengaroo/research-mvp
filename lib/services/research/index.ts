export { discoverCompanies, researchConfirmedCompanies } from './pipeline';
export type { PipelineConfig } from './pipeline';
export { apolloCompanyDiscovery } from './discovery';
export { claudeCompanyScorer } from './scoring';
export { claudeResearchAgent } from './research-agent';
export { researchBodySchema } from './schemas';
export type {
  SourceLink,
  CompanySignal,
  TargetContact,
  CompanyResult,
  DiscoveredCompanyPreview,
  ResearchStreamEvent
} from './types';
