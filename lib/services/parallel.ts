import Parallel from 'parallel-web';
import type { ICPCriteria } from '@/lib/types';

function getClient() {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) throw new Error('PARALLEL_API_KEY is not set');
  return new Parallel({ apiKey });
}

export interface FindAllCompany {
  name: string;
  website?: string;
  description?: string;
}

export async function findCompanies(
  icp: ICPCriteria,
  limit: number = 5
): Promise<FindAllCompany[]> {
  const client = getClient();

  const conditions: { name: string; description: string }[] = [];

  if (icp.min_funding_amount) {
    conditions.push({
      name: 'Funding',
      description: `Has raised at least $${icp.min_funding_amount / 1_000_000}M in funding`
    });
  }
  if (icp.hiring_signals.length > 0) {
    conditions.push({
      name: 'Hiring signals',
      description: `Currently hiring for roles related to: ${icp.hiring_signals.join(', ')}`
    });
  }
  if (icp.tech_keywords.length > 0) {
    conditions.push({
      name: 'Technology',
      description: `Works with or builds technology related to: ${icp.tech_keywords.join(', ')}`
    });
  }
  if (icp.funding_stages.length > 0) {
    conditions.push({
      name: 'Funding stage',
      description: `At funding stage: ${icp.funding_stages.join(' or ')}`
    });
  }

  if (conditions.length === 0) {
    conditions.push({
      name: 'Match criteria',
      description: icp.description
    });
  }

  const run = await client.beta.findall.create({
    objective: icp.description,
    entity_type: 'companies',
    match_conditions: conditions,
    generator: 'preview',
    match_limit: limit
  });

  // Poll until complete
  const findallId = run.findall_id;
  let runStatus = run.status.status;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 5000));
    const check = await client.beta.findall.retrieve(findallId);
    runStatus = check.status.status;
    attempts++;
  }

  if (runStatus !== 'completed') {
    throw new Error(`FindAll run ${findallId} ended with status: ${runStatus}`);
  }

  const result = await client.beta.findall.result(findallId);

  return result.candidates
    .filter((c) => c.match_status === 'matched')
    .map((c) => ({
      name: c.name,
      website: c.url || undefined,
      description: c.description || undefined
    }));
}

export async function researchCompany(
  companyName: string,
  icp: ICPCriteria
): Promise<{ research_text: string }> {
  const client = getClient();

  const input = `Research the company "${companyName}" in depth. Find:
1. Current job postings, especially related to: ${icp.hiring_signals.join(', ')}
2. Recent funding rounds and total amount raised
3. Recent news, product launches, or announcements
4. Technology stack and infrastructure they use or build
5. Key leadership team members

Focus on signals relevant to: ${icp.description}`;

  const run = await client.taskRun.create({
    input,
    processor: 'lite'
  });

  // result() blocks until the run completes
  const result = await client.taskRun.result(run.run_id);
  const output = result.output;

  let text: string;
  if ('content' in output) {
    const content = output.content;
    text = typeof content === 'string' ? content : JSON.stringify(content);
  } else {
    text = JSON.stringify(output);
  }

  return { research_text: text };
}
