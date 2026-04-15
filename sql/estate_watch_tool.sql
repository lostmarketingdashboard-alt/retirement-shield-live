create extension if not exists pgcrypto;

create table if not exists public.estate_watch_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  state_code text not null,
  state_name text not null,
  quiz_profile text not null,
  annual_review_changes text[] not null default '{}',
  tracked_change_count integer not null default 0,
  review_urgency_score integer not null default 0,
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_estate_watch_reports_user_created_at
  on public.estate_watch_reports (user_id, created_at desc);

create table if not exists public.estate_watch_state_changes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  state_code text not null,
  state_name text not null,
  category text,
  effective_date date,
  headline text not null,
  summary text,
  why_it_matters text,
  recommended_action text,
  source_label text,
  source_url text,
  ai_model text,
  is_active boolean not null default true
);

create index if not exists idx_estate_watch_state_changes_state
  on public.estate_watch_state_changes (state_code, effective_date desc);

alter table public.estate_watch_reports enable row level security;
alter table public.estate_watch_state_changes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'estate_watch_reports'
      and policyname = 'Users can view their own estate watch reports'
  ) then
    create policy "Users can view their own estate watch reports"
      on public.estate_watch_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'estate_watch_reports'
      and policyname = 'Users can insert their own estate watch reports'
  ) then
    create policy "Users can insert their own estate watch reports"
      on public.estate_watch_reports
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'estate_watch_state_changes'
      and policyname = 'Public can read estate watch state changes'
  ) then
    create policy "Public can read estate watch state changes"
      on public.estate_watch_state_changes
      for select
      using (true);
  end if;
end $$;
