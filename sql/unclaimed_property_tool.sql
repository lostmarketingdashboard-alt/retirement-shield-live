create extension if not exists pgcrypto;

create table if not exists public.unclaimed_property_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  state_code text not null,
  state_name text not null,
  search_targets text[] not null default '{}',
  proof_level text,
  prior_states text,
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_unclaimed_property_reports_user_created_at
  on public.unclaimed_property_reports (user_id, created_at desc);

create table if not exists public.unclaimed_property_state_links (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  state_code text not null unique,
  state_name text not null,
  agency_name text,
  search_url text,
  search_label text,
  search_hint text,
  documents_hint text,
  step_1 text,
  step_2 text,
  step_3 text,
  notes text,
  is_active boolean not null default true
);

create index if not exists idx_unclaimed_property_state_links_active
  on public.unclaimed_property_state_links (state_code, is_active);

alter table public.unclaimed_property_reports enable row level security;
alter table public.unclaimed_property_state_links enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'unclaimed_property_reports'
      and policyname = 'Users can view their own unclaimed property reports'
  ) then
    create policy "Users can view their own unclaimed property reports"
      on public.unclaimed_property_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'unclaimed_property_reports'
      and policyname = 'Users can insert their own unclaimed property reports'
  ) then
    create policy "Users can insert their own unclaimed property reports"
      on public.unclaimed_property_reports
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'unclaimed_property_state_links'
      and policyname = 'Public can read unclaimed property state links'
  ) then
    create policy "Public can read unclaimed property state links"
      on public.unclaimed_property_state_links
      for select
      using (is_active = true);
  end if;
end $$;
