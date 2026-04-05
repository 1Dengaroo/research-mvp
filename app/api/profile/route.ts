import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { profileUpdateBodySchema } from '@/lib/validation';
import { getProfile, upsertProfile } from '@/lib/supabase/queries';

export const GET = () =>
  withAuth(async (supabase, user) => {
    const { data } = await getProfile(supabase, user.id);
    return Response.json({
      full_name: data?.full_name ?? '',
      company_name: data?.company_name ?? ''
    });
  });

export const PUT = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const parsed = parseBody(profileUpdateBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const fullName = parsed.data.full_name.trim();
    const companyName = (parsed.data.company_name ?? '').trim();

    const { error } = await upsertProfile(supabase, user.id, fullName, companyName);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);

    return Response.json({ full_name: fullName, company_name: companyName });
  });
