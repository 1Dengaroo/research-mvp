import { NextRequest } from 'next/server';
import { withAuth, jsonError } from '@/lib/route-utils';
import { listResearchedCompanyNames } from '@/lib/supabase/queries';

export const GET = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const excludeSessionId = req.nextUrl.searchParams.get('exclude') ?? undefined;
    const { data: companies, error } = await listResearchedCompanyNames(
      supabase,
      user.id,
      excludeSessionId
    );
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ companies });
  });
