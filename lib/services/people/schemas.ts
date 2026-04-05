import { z } from 'zod';
import { icpCriteriaSchema } from '../icp/schemas';

const shortStr = z.string().max(500);

export const peopleSearchBodySchema = z.object({
  org_ids: z.array(shortStr).max(200),
  icp: icpCriteriaSchema,
  companies: z
    .array(
      z.object({
        name: shortStr,
        apollo_org_id: shortStr
      })
    )
    .max(200)
});

export const peopleBulkBodySchema = z.object({
  companies: z
    .array(
      z.object({
        name: shortStr,
        apollo_org_id: shortStr
      })
    )
    .max(200)
});

export const peopleEnrichBodySchema = z.object({
  person_id: shortStr.min(1)
});
