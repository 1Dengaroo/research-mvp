import { requireAuth } from '@/lib/supabase/server';
import { getGmailEmail } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data: connection } = await getGmailEmail(supabase, user.id);

  return Response.json({
    connected: !!connection,
    email: connection?.gmail_email ?? null
  });
}
