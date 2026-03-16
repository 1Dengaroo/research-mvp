import type { ICPCriteria } from '@/lib/types';

export function buildCompanySummaryPrompt(
  company: {
    name: string;
    description?: string;
    match_reasoning?: string;
    research_text: string;
  },
  icp: ICPCriteria
): string {
  const findallContext = [
    company.description ? `FindAll summary: ${company.description}` : '',
    company.match_reasoning ? `FindAll match evaluation: ${company.match_reasoning}` : ''
  ]
    .filter(Boolean)
    .join('\n');

  return `You are an expert sales researcher. Given research about "${company.name}", extract precise signals, infer likely decision makers, and write a sharp email hook. Return ONLY valid JSON.

${findallContext ? `--- DISCOVERY CONTEXT ---\n${findallContext}\n` : ''}
--- DEEP RESEARCH ---
${company.research_text}

--- ICP CRITERIA ---
- Looking for: ${icp.description}
- Industry keywords: ${icp.industry_keywords.join(', ')}
- Hiring signals: ${icp.hiring_signals.join(', ')}
- Tech keywords: ${icp.tech_keywords.join(', ')}

Return JSON matching this schema exactly:
{
  "signals": [
    {
      "type": "job_posting" | "news" | "funding" | "product_launch" | "other",
      "title": "brief signal description",
      "key_phrases": ["exact phrases from the research that triggered this signal"]
    }
  ],
  "match_reason": "One specific sentence on why this company fits the ICP — cite a concrete fact, not a generic statement",
  "company_overview": "2-3 sentences: what the company does, their current stage, and specifically why they are a fit for the product/service described in the ICP. Be concrete.",
  "email_hook": "One sentence to open a cold email that references a SPECIFIC signal (job posting title, funding round, product name). Do NOT be generic — mention something only this company would recognize.",
  "industry": "primary industry",
  "funding_stage": "latest funding stage or 'Unknown'",
  "amount_raised": "total raised or latest round, e.g. '$150M Series C' or 'Unknown'",
  "inferred_contacts": [
    {
      "name": "Full name if found in research, otherwise a realistic placeholder like 'VP of Engineering'",
      "title": "Their title",
      "email": "best guess email or null",
      "is_decision_maker": true or false
    }
  ]
}

For inferred_contacts: Look through the research for named executives, founders, VPs, or hiring managers. List 1-3 people. Mark 1-2 as decision makers — these are the people who would sign a contract for what the ICP describes (typically VP+, C-suite, or Head of the relevant department). If you find real names in the research, use them. If not, infer the most likely titles (e.g. "VP of Infrastructure", "Head of ML Platform") based on the company's org and the ICP.

For email: If you know the company domain (from website or research), infer the most likely email using common patterns: first@domain.com, first.last@domain.com, or firstlast@domain.com. Use the most common pattern for tech companies (first@domain.com or first.last@domain.com). Only generate an email if you have both a real person name AND a domain. Set to null if either is unknown.

EXAMPLES of good vs bad output:

BAD email_hook: "I noticed your company is growing and hiring — would love to chat."
GOOD email_hook: "Saw your Senior MLOps Engineer posting mentions Kubernetes GPU scheduling — we built exactly that for teams scaling past 500 GPUs."

BAD match_reason: "They are an AI company that matches the criteria."
GOOD match_reason: "Their $85M Series B and three open GPU infrastructure roles signal they're scaling compute faster than their platform team can build."

BAD company_overview: "This is a technology company that does AI things."
GOOD company_overview: "Replicate provides a cloud API for running open-source ML models, recently raised $40M Series B to expand GPU capacity. Their push into enterprise inference hosting creates a direct need for GPU scheduling and orchestration tooling — exactly the infrastructure layer the ICP describes."`;
}
