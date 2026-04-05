import { z } from 'zod';
import { icpCriteriaSchema } from '../icp/schemas';

const longStr = z.string().max(50_000);

export const strategyMessageSchema = z.object({
  role: z.enum(['assistant', 'user']),
  content: longStr
});

export const strategyBodySchema = z.object({
  icp: icpCriteriaSchema,
  messages: z.array(strategyMessageSchema).max(200).optional()
});
