import { NextRequest } from 'next/server';
import { withAuth, parseBody, requireEnvVars } from '@/lib/route-utils';
import { strategyBodySchema, streamStrategy } from '@/lib/services/strategy';

export const POST = (req: NextRequest) =>
  withAuth(async () => {
    const parsed = parseBody(strategyBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const envError = requireEnvVars('ANTHROPIC_API_KEY');
    if (envError) return envError;

    const { icp, messages } = parsed.data;

    return new Response(streamStrategy(icp, messages), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  });
