import { requireAuth } from '@/lib/supabase/server';
import { deleteGmailConnection } from '@/lib/supabase/queries';

export async function POST() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  await deleteGmailConnection(supabase, user.id);

  return Response.json({ success: true });
}
