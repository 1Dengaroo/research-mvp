import { withAuth } from '@/lib/route-utils';
import { getGmailEmail } from '@/lib/supabase/queries';

export const GET = () =>
  withAuth(async (supabase, user) => {
    const { data: connection } = await getGmailEmail(supabase, user.id);
    return Response.json({
      connected: !!connection,
      email: connection?.gmail_email ?? null
    });
  });
