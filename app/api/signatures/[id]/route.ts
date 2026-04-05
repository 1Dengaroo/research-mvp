import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { signatureUpdateBodySchema } from '@/lib/validation';
import { updateSignatureWithDefault, deleteSignature } from '@/lib/supabase/queries';

export const PATCH = (req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const parsed = parseBody(signatureUpdateBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { data, error } = await updateSignatureWithDefault(supabase, id, user.id, parsed.data);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json(data);
  });

export const DELETE = (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  withAuth(async (supabase, user) => {
    const { id } = await params;
    const { error } = await deleteSignature(supabase, id, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ success: true });
  });
