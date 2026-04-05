import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { createIcpBodySchema } from '@/lib/services/icp';
import { listICPs, createICP } from '@/lib/supabase/queries';

export const GET = () =>
  withAuth(async (supabase, user) => {
    const { data, error } = await listICPs(supabase, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ icps: data });
  });

export const POST = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const parsed = parseBody(createIcpBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { name, icp } = parsed.data;
    const { data, error } = await createICP(supabase, user.id, name, icp);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json(data, { status: 201 });
  });
