import { requireAuth } from '@/lib/supabase/server';
import { getGoogleAuthUrl } from '@/lib/services/gmail';

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return Response.json({ error: 'Gmail OAuth not configured' }, { status: 500 });
  }

  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const url = getGoogleAuthUrl(auth.user.id);
  return Response.json({ url });
}
