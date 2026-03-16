import Anthropic from '@anthropic-ai/sdk';
import type { ICPCriteria, CompanySignal, TargetContact } from '@/lib/types';
import type { FindAllCompany } from '@/lib/services/parallel';
import { buildParseICPPrompt } from '@/lib/prompts/parse-icp';
import { buildRankCompaniesPrompt } from '@/lib/prompts/rank-companies';
import { buildCompanySummaryPrompt } from '@/lib/prompts/company-summary';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
}

function extractText(message: Anthropic.Message): string {
  return message.content[0].type === 'text' ? message.content[0].text : '';
}

function isICPCriteria(value: unknown): value is ICPCriteria {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.description === 'string' &&
    Array.isArray(obj.industry_keywords) &&
    Array.isArray(obj.hiring_signals) &&
    Array.isArray(obj.tech_keywords) &&
    Array.isArray(obj.company_examples)
  );
}

export async function parseQueryToICP(input: string): Promise<ICPCriteria> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildParseICPPrompt(input) }]
  });

  const jsonMatch = extractText(message).match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse ICP from query');

  const parsed: unknown = JSON.parse(jsonMatch[0]);
  if (!isICPCriteria(parsed)) throw new Error('Invalid ICP shape from AI');
  return parsed;
}

export async function rankCompanies(
  companies: FindAllCompany[],
  icp: ICPCriteria,
  topN: number = 3
): Promise<string[]> {
  if (companies.length <= topN) return companies.map((c) => c.name);

  const client = getClient();

  const companySummaries = companies
    .map(
      (c, i) =>
        `${i + 1}. ${c.name}${c.description ? ` — ${c.description}` : ''}${c.match_reasoning ? ` | Match data: ${c.match_reasoning.slice(0, 300)}` : ''}`
    )
    .join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{ role: 'user', content: buildRankCompaniesPrompt(companySummaries, icp, topN) }]
  });

  const jsonMatch = extractText(message).match(/\[[\s\S]*\]/);
  if (!jsonMatch) return companies.slice(0, topN).map((c) => c.name);

  try {
    const ranked: unknown = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(ranked) || !ranked.every((v) => typeof v === 'string')) {
      return companies.slice(0, topN).map((c) => c.name);
    }
    return ranked.slice(0, topN);
  } catch {
    return companies.slice(0, topN).map((c) => c.name);
  }
}

export async function generateCompanySummary(
  company: {
    name: string;
    website?: string;
    description?: string;
    match_reasoning?: string;
    research_text: string;
  },
  icp: ICPCriteria
): Promise<{
  signals: CompanySignal[];
  match_reason: string;
  company_overview: string;
  email_hook: string;
  industry: string;
  funding_stage: string;
  amount_raised: string;
  inferred_contacts: TargetContact[];
}> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: buildCompanySummaryPrompt(company, icp) }]
  });

  const jsonMatch = extractText(message).match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Failed to generate summary for ${company.name}`);
  return JSON.parse(jsonMatch[0]);
}
