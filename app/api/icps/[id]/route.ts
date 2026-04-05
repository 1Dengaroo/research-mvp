import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { updateIcpBodySchema } from '@/lib/services/icp';
import { updateICP, deleteICP } from '@/lib/supabase/queries';

export const PATCH = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const parsed = parseBody(updateIcpBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const updates: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.icp !== undefined) updates.icp = parsed.data.icp;

    const { data, error } = await updateICP(supabase, id, user.id, updates);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json(data);
  });

export const DELETE = (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const { error } = await deleteICP(supabase, id, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ success: true });
  });
