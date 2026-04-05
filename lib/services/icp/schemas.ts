import { z } from 'zod';

/** String capped at a reasonable length to prevent payload bloat */
const shortStr = z.string().max(500);
const mediumStr = z.string().max(5_000);

/** Array of short strings, capped at a sane count */
function strArray(maxItems: number) {
  return z.array(shortStr).max(maxItems);
}

export const icpCriteriaSchema = z.object({
  description: mediumStr,
  industry_keywords: strArray(50),
  min_employees: z.number().nullable(),
  max_employees: z.number().nullable(),
  min_funding_amount: z.number().nullable(),
  funding_stages: strArray(20),
  hiring_signals: strArray(50),
  tech_keywords: strArray(50),
  company_examples: strArray(50),
  locations: strArray(50).default([])
});

export const createIcpBodySchema = z.object({
  name: shortStr.min(1),
  icp: icpCriteriaSchema
});

export const updateIcpBodySchema = z.object({
  name: shortStr.optional(),
  icp: icpCriteriaSchema.optional()
});

export const parseIcpBodySchema = z.object({
  input: z.string().max(50_000).min(1)
});
