import { withAuth, requireEnvVars } from '@/lib/route-utils';
import { getGoogleAuthUrl } from '@/lib/services/gmail';

export const GET = () =>
  withAuth(async (_supabase, user) => {
    const envError = requireEnvVars('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET');
    if (envError) return envError;

    const url = getGoogleAuthUrl(user.id);
    return Response.json({ url });
  });
