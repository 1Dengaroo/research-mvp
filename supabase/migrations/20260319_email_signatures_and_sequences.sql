-- Email signatures
create table email_signatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  body text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_email_signatures_user on email_signatures(user_id);

alter table email_signatures enable row level security;

create policy "Users manage own signatures" on email_signatures for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Add email_sequences jsonb column to research_sessions
alter table research_sessions
  add column email_sequences jsonb default '{}'::jsonb;
