import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { sessionCreateBodySchema } from '@/lib/validation';
import { listSessionSummaries, createSession } from '@/lib/supabase/queries';

export const GET = () =>
  withAuth(async (supabase, user) => {
    const { data: sessions, error } = await listSessionSummaries(supabase, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ sessions });
  });

export const POST = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const parsed = parseBody(sessionCreateBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { data, error } = await createSession(supabase, { user_id: user.id, ...parsed.data });
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json(data, { status: 201 });
  });
