export function buildParseICPPrompt(input: string): string {
  return `Extract the Ideal Customer Profile (ICP) from this input. It may be a scoping call transcript, meeting notes, a short query, or a description of a target market.

IMPORTANT: Think broadly about who the ideal customer is. The input describes the PRODUCT being sold and the TYPE of buyer — not a narrow industry vertical. For example:
- If someone sells "sales automation software for B2B SaaS companies", the industry keywords should include ALL relevant B2B SaaS verticals (healthcare SaaS, developer tools, cybersecurity, fintech, HR tech, etc.) — not just "sales automation".
- If someone sells "GPU infrastructure for AI teams", the industry should include any company doing AI/ML (biotech, autonomous vehicles, ad tech, etc.) — not just "GPU infrastructure".

The industry_keywords field should capture the BREADTH of potential buyers, not just echo back the product category.

Return ONLY valid JSON matching this exact schema, no other text:

{
  "description": "one sentence summary of the ideal customer they want to find — describe the BUYER, not the product being sold",
  "industry_keywords": ["broad list of industries and verticals where these buyers exist — think 5-10 diverse verticals, not just the product's own category"],
  "min_funding_amount": number or null,
  "funding_stages": ["Series A", "Series B", etc] or [],
  "hiring_signals": ["job titles, roles, or hiring patterns that indicate buying intent"],
  "tech_keywords": ["specific technologies, tools, or infrastructure the buyer would use or be adopting"],
  "company_examples": ["any companies mentioned as examples or comparisons"]
}

Input:
${input}`;
}
