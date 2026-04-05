import { z } from 'zod';
import { icpCriteriaSchema } from '../icp/schemas';

const shortStr = z.string().max(500);
const mediumStr = z.string().max(5_000);
const urlStr = z.string().max(2_000);

const candidateLoose = z
  .object({
    name: shortStr,
    website: urlStr.optional(),
    description: mediumStr.optional(),
    linkedin_url: urlStr.optional(),
    logo_url: urlStr.optional(),
    apollo_org_id: shortStr.optional(),
    location: shortStr.optional()
  })
  .loose();

export const researchBodySchema = z.object({
  icp: icpCriteriaSchema,
  companies: z.array(shortStr).max(200).optional(),
  candidates: z.array(candidateLoose).max(200).optional()
});
