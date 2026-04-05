import { withAuth, jsonError } from '@/lib/route-utils';
import { deleteGmailConnection } from '@/lib/supabase/queries';

export const POST = () =>
  withAuth(async (supabase, user) => {
    const { error } = await deleteGmailConnection(supabase, user.id);
    if (error) return jsonError('INTERNAL_ERROR', error.message, 500);
    return Response.json({ success: true });
  });
