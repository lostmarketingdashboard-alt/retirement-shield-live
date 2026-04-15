create extension if not exists pgcrypto;

create table if not exists public.shield_brief_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  state_code text not null,
  state_name text not null,
  county_name text not null,
  county_population bigint,
  quiz_segment text not null,
  segment_label text,
  generated_month text,
  inflation_yoy numeric(8,4),
  medical_inflation_yoy numeric(8,4),
  fed_funds_rate numeric(8,4),
  treasury_rate numeric(8,4),
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_shield_brief_reports_user_created_at
  on public.shield_brief_reports (user_id, created_at desc);

create table if not exists public.shield_brief_state_watch_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  state_code text not null,
  state_name text not null,
  category text,
  effective_date date,
  headline text not null,
  summary text,
  source_label text,
  source_url text,
  is_active boolean not null default true
);

create index if not exists idx_shield_brief_state_watch_items_state
  on public.shield_brief_state_watch_items (state_code, effective_date desc);

alter table public.shield_brief_reports enable row level security;
alter table public.shield_brief_state_watch_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shield_brief_reports'
      and policyname = 'Users can view their own shield brief reports'
  ) then
    create policy "Users can view their own shield brief reports"
      on public.shield_brief_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shield_brief_reports'
      and policyname = 'Users can insert their own shield brief reports'
  ) then
    create policy "Users can insert their own shield brief reports"
      on public.shield_brief_reports
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shield_brief_state_watch_items'
      and policyname = 'Public can read shield brief state watch items'
  ) then
    create policy "Public can read shield brief state watch items"
      on public.shield_brief_state_watch_items
      for select
      using (true);
  end if;
end $$;
