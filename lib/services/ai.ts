import Anthropic from '@anthropic-ai/sdk';
import type { ICPCriteria } from '@/lib/types';
import type { ICPParser } from './interfaces';
import { serviceConfig } from './config';
import { buildParseICPPrompt } from '@/lib/prompts/parse-icp';
import { extractJson } from '@/lib/utils';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
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

/**
 * Claude-based ICP parser.
 */
export const claudeICPParser: ICPParser = {
  async parse(input: string): Promise<ICPCriteria> {
    const client = getClient();

    const message = await client.messages.create({
      model: serviceConfig.fastModel,
      max_tokens: serviceConfig.parseMaxTokens,
      messages: [{ role: 'user', content: buildParseICPPrompt(input) }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    const parsed: unknown = extractJson(text);
    if (!parsed) throw new Error('Failed to parse ICP from input');
    if (!isICPCriteria(parsed)) throw new Error('Invalid ICP shape from AI');

    // Default fields the model may omit
    parsed.min_employees = parsed.min_employees ?? null;
    parsed.max_employees = parsed.max_employees ?? null;
    parsed.min_funding_amount = parsed.min_funding_amount ?? null;
    parsed.funding_stages = parsed.funding_stages ?? [];
    parsed.locations = parsed.locations ?? [];

    return parsed;
  }
};
