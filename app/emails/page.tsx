import { createClient } from '@/lib/supabase/server';
import { SentEmailsPage } from '@/components/emails/sent-emails-page.client';
import type { SentEmail } from '@/lib/types';

export default async function Emails() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let emails: SentEmail[] = [];

  if (user) {
    const { data } = await supabase
      .from('sent_emails')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    emails = (data ?? []) as SentEmail[];
  }

  return <SentEmailsPage emails={emails} />;
}
