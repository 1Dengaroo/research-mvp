import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { sessionUpdateBodySchema } from '@/lib/validation';
import { getSession, updateSession, deleteSession } from '@/lib/supabase/queries';

export const GET = (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const { data, error } = await getSession(supabase, id, user.id);
    if (error) return jsonError('NOT_FOUND', error.message, 404);
    return Response.json(data);
  });

export const PATCH = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const parsed = parseBody(sessionUpdateBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { error } = await updateSession(supabase, id, user.id, parsed.data);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json({ success: true });
  });

export const DELETE = (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const { error } = await deleteSession(supabase, id, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ success: true });
  });
