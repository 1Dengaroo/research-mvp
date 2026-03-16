import type { ICPCriteria } from '@/lib/types';

export function buildRankCompaniesPrompt(
  companySummaries: string,
  icp: ICPCriteria,
  topN: number
): string {
  return `Given this ICP and candidate companies, return ONLY a JSON array of the top ${topN} company names that best fit the ICP. Rank by relevance. Return just the array, no other text.

ICP: ${icp.description}
- Industry: ${icp.industry_keywords.join(', ')}
- Hiring signals: ${icp.hiring_signals.join(', ')}
- Tech: ${icp.tech_keywords.join(', ')}
${icp.min_funding_amount ? `- Min funding: $${icp.min_funding_amount / 1_000_000}M` : ''}

Candidates:
${companySummaries}`;
}
