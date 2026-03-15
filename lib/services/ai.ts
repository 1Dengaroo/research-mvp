import Anthropic from '@anthropic-ai/sdk';
import type { ICPCriteria, CompanyResult, CompanySignal, TargetContact } from '@/lib/types';

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
}

export async function parseQueryToICP(query: string): Promise<ICPCriteria> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Parse this research query into structured ICP (Ideal Customer Profile) criteria. Return ONLY valid JSON matching this exact schema, no other text:

{
  "description": "one sentence summary of what they're looking for",
  "industry_keywords": ["keyword1", "keyword2"],
  "min_funding_amount": number or null,
  "funding_stages": ["Series A", "Series B", etc] or [],
  "hiring_signals": ["job titles or role keywords they care about"],
  "tech_keywords": ["specific technologies or capabilities mentioned"],
  "company_examples": ["any companies mentioned as examples"]
}

Query: "${query}"`
      }
    ]
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse ICP from query');
  return JSON.parse(jsonMatch[0]) as ICPCriteria;
}

export async function generateCompanySummary(
  company: {
    name: string;
    industry?: string;
    funding_stage?: string;
    amount_raised?: string;
    website?: string;
    research_text: string;
  },
  icp: ICPCriteria,
  contact: TargetContact | null
): Promise<{
  signals: CompanySignal[];
  match_reason: string;
  email_hook: string;
  industry: string;
  funding_stage: string;
  amount_raised: string;
}> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Given this research about "${company.name}" and the ICP criteria, generate structured output. Return ONLY valid JSON.

Research data:
${company.research_text}

ICP criteria:
- Looking for: ${icp.description}
- Industry keywords: ${icp.industry_keywords.join(', ')}
- Hiring signals: ${icp.hiring_signals.join(', ')}
- Tech keywords: ${icp.tech_keywords.join(', ')}

${contact ? `Target contact: ${contact.name}, ${contact.title}` : ''}

Return JSON:
{
  "signals": [
    {
      "type": "job_posting" | "news" | "funding" | "product_launch" | "other",
      "title": "signal description",
      "key_phrases": ["phrase1", "phrase2"]
    }
  ],
  "match_reason": "One sentence explaining why this company matches the ICP",
  "email_hook": "One compelling sentence that could open a cold email, referencing a specific signal${contact ? ` and addressing ${contact.name} by name` : ''}",
  "industry": "primary industry",
  "funding_stage": "latest funding stage or 'Unknown'",
  "amount_raised": "total raised or latest round amount, e.g. '$150M Series C' or 'Unknown'"
}`
      }
    ]
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Failed to generate summary for ${company.name}`);
  return JSON.parse(jsonMatch[0]);
}
