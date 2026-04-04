import { requireAuth } from '@/lib/supabase/server';
import { listContacts } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data, error } = await listContacts(supabase, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ contacts: data });
}
