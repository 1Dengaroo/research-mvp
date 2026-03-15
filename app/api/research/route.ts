import { NextRequest } from 'next/server';
import { parseQueryToICP, generateCompanySummary } from '@/lib/services/ai';
import { findCompanies, researchCompany } from '@/lib/services/parallel';
import { findContact } from '@/lib/services/apollo';
import type { ResearchStreamEvent, CompanyResult } from '@/lib/types';

export const maxDuration = 300; // 5 minute timeout

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query || typeof query !== 'string') {
    return Response.json({ error: 'Query is required' }, { status: 400 });
  }

  // Check required API keys
  const missing: string[] = [];
  if (!process.env.ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY');
  if (!process.env.PARALLEL_API_KEY) missing.push('PARALLEL_API_KEY');
  // Apollo is optional — we'll skip contact enrichment if missing

  if (missing.length > 0) {
    return Response.json(
      {
        error: `Missing required environment variables: ${missing.join(', ')}. Add them to .env.local`
      },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: ResearchStreamEvent) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }

      try {
        // Step 1: Parse query into ICP
        send({ type: 'status', message: 'Parsing your query into research criteria...' });
        const icp = await parseQueryToICP(query);
        send({ type: 'icp', data: icp });

        // Step 2: Find companies via Parallel FindAll
        send({
          type: 'status',
          message: `Searching for companies matching: ${icp.description}`
        });
        const allCompanies = await findCompanies(icp);
        const companies = allCompanies.slice(0, 3);

        if (companies.length === 0) {
          send({ type: 'status', message: 'No companies found matching your criteria.' });
          send({ type: 'done', total: 0 });
          controller.close();
          return;
        }

        send({
          type: 'status',
          message: `Found ${companies.length} companies. Researching each one...`
        });

        // Step 3: Research all companies concurrently, stream each as it completes
        let completedCount = 0;

        const processCompany = async (company: (typeof companies)[number]) => {
          try {
            // Research and contact enrichment in parallel
            const [research, contact] = await Promise.all([
              researchCompany(company.name, icp),
              process.env.APOLLO_API_KEY
                ? findContact(company.name, icp.hiring_signals).catch(() => null)
                : Promise.resolve(null)
            ]);

            // Generate summary with Claude
            const summary = await generateCompanySummary(
              {
                name: company.name,
                website: company.website,
                research_text: research.research_text
              },
              icp,
              contact
            );

            const result: CompanyResult = {
              company_name: company.name,
              industry: summary.industry,
              funding_stage: summary.funding_stage,
              amount_raised: summary.amount_raised,
              website: company.website || null,
              signals: summary.signals,
              match_reason: summary.match_reason,
              target_contact: contact,
              email_hook: summary.email_hook
            };

            completedCount++;
            send({ type: 'company', data: result });
            send({
              type: 'status',
              message: `Researched ${completedCount}/${companies.length} companies...`
            });
          } catch (err) {
            console.error(`Error processing ${company.name}:`, err);
            send({
              type: 'status',
              message: `Skipped ${company.name} due to an error.`
            });
          }
        };

        await Promise.all(companies.map(processCompany));

        send({ type: 'done', total: completedCount });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        send({ type: 'error', message });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
