import { withAuth, jsonError } from '@/lib/route-utils';
import { listContacts } from '@/lib/supabase/queries';

export const GET = () =>
  withAuth(async (supabase, user) => {
    const { data, error } = await listContacts(supabase, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ contacts: data });
  });
