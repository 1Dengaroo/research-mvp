import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const excludeSessionId = req.nextUrl.searchParams.get('exclude');

  let query = supabase
    .from('research_sessions')
    .select('results')
    .eq('user_id', user.id)
    .not('results', 'is', null);

  if (excludeSessionId) {
    query = query.neq('id', excludeSessionId);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const companies = new Set<string>();
  for (const row of data ?? []) {
    const results = row.results as { company_name: string }[] | null;
    if (Array.isArray(results)) {
      for (const r of results) {
        if (r.company_name) companies.add(r.company_name);
      }
    }
  }

  return Response.json({ companies: [...companies] });
}
