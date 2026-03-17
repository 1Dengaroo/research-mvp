import { NextRequest } from 'next/server';
import { apolloPersonEnrich } from '@/lib/services/apollo-people';

export async function POST(req: NextRequest) {
  const body: Record<string, unknown> = await req.json();

  const personId = typeof body.person_id === 'string' ? body.person_id : undefined;

  if (!personId) {
    return Response.json({ error: 'person_id is required' }, { status: 400 });
  }

  if (!process.env.APOLLO_API_KEY) {
    return Response.json({ error: 'APOLLO_API_KEY is not set' }, { status: 500 });
  }

  try {
    const person = await apolloPersonEnrich(personId);
    return Response.json({ person });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Person enrichment failed';
    console.error('[People Enrich]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
