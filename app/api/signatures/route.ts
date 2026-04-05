import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { signatureCreateBodySchema } from '@/lib/validation';
import { listSignatures, createSignature } from '@/lib/supabase/queries';

export const GET = () =>
  withAuth(async (supabase, user) => {
    const { data, error } = await listSignatures(supabase, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ signatures: data });
  });

export const POST = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const parsed = parseBody(signatureCreateBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { name, body: signatureBody } = parsed.data;
    const { data, error } = await createSignature(supabase, user.id, name, signatureBody);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json(data, { status: 201 });
  });
