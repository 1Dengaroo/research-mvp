import type { CompanyResult, TargetContact, ICPCriteria } from '@/lib/types';

export function buildEmailGenerationPrompt(
  company: CompanyResult,
  contact: TargetContact,
  icp: ICPCriteria
): string {
  const signalsSummary = company.signals.map((s) => `- ${s.type}: ${s.title}`).join('\n');

  return `Write a short, personalized cold outreach email to ${contact.name} (${contact.title}) at ${company.company_name}.

CONTEXT:
- Company: ${company.company_name}
- Industry: ${company.industry}
- Overview: ${company.company_overview}
- Funding: ${company.funding_stage} (${company.amount_raised})
- Buying signals detected:
${signalsSummary}
- Email hook (use as inspiration): ${company.email_hook}
- ICP description: ${icp.description}

RULES:
- Keep it under 150 words
- Lead with a specific signal or insight about their company, not a generic compliment
- One clear value proposition tied to their situation
- One soft CTA (e.g., "worth a quick chat?" not "book a demo")
- Professional but conversational tone
- No buzzwords, no "I hope this finds you well", no "I noticed that"
- Do NOT include a signature block, the sender will add their own
- Subject line: use simple punctuation only. No em dashes, no special characters. Use commas, colons, or hyphens instead.

Return ONLY valid JSON with this exact shape:
{
  "subject": "short, specific subject line (not generic)",
  "body": "the email body text"
}`;
}
