import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: Record<string, unknown> = await req.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.name === 'string') updates.name = body.name;
  if (typeof body.body === 'string') updates.body = body.body;
  if (typeof body.is_default === 'boolean') {
    // Clear default on all other signatures first
    if (body.is_default) {
      await supabase
        .from('email_signatures')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .neq('id', id);
    }
    updates.is_default = body.is_default;
  }

  const { data, error } = await supabase
    .from('email_signatures')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('email_signatures')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
