create extension if not exists pgcrypto;

create table if not exists public.retirement_relocation_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  share_slug text not null unique,
  current_address text,
  current_state_name text,
  current_county_name text,
  current_home_value numeric(14,2),
  annual_budget numeric(14,2),
  annual_taxable_income numeric(14,2),
  primary_destination_address text,
  primary_destination_state_name text,
  primary_destination_county_name text,
  primary_destination_home_value numeric(14,2),
  secondary_destination_address text,
  secondary_destination_state_name text,
  secondary_destination_county_name text,
  secondary_destination_home_value numeric(14,2),
  best_first_year_impact numeric(14,2),
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_retirement_relocation_reports_user_created_at
  on public.retirement_relocation_reports (user_id, created_at desc);

create unique index if not exists idx_retirement_relocation_reports_share_slug
  on public.retirement_relocation_reports (share_slug);

alter table public.retirement_relocation_reports enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'retirement_relocation_reports'
      and policyname = 'Users can view their own relocation reports'
  ) then
    create policy "Users can view their own relocation reports"
      on public.retirement_relocation_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'retirement_relocation_reports'
      and policyname = 'Users can insert their own relocation reports'
  ) then
    create policy "Users can insert their own relocation reports"
      on public.retirement_relocation_reports
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
