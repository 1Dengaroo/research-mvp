import { NextRequest } from 'next/server';
import { withAuth, parseBody, requireEnvVars } from '@/lib/route-utils';
import { emailGenerateBodySchema, streamEmailGeneration } from '@/lib/services/email';

export const POST = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const envError = requireEnvVars('ANTHROPIC_API_KEY');
    if (envError) return envError;

    const parsed = parseBody(emailGenerateBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { company, contact, icp } = parsed.data;
    const stream = streamEmailGeneration(supabase, user, company, contact, icp);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  });
