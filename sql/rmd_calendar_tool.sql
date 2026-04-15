create extension if not exists pgcrypto;

create table if not exists public.rmd_calendar_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  state_code text,
  state_name text,
  county_name text,
  zip_code text,
  filing_status text,
  current_age integer,
  birth_year integer,
  required_beginning_age integer not null,
  first_rmd_year integer not null,
  rmd_stage text not null,
  prior_year_end_balance numeric(14,2) not null default 0,
  projected_growth_rate_pct numeric(6,2) not null default 0,
  marginal_federal_tax_rate_pct numeric(6,2) not null default 0,
  state_tax_rate_pct numeric(6,2) not null default 0,
  other_taxable_income numeric(14,2) not null default 0,
  next_rmd_amount numeric(14,2) not null default 0,
  next_rmd_deadline date,
  next_rmd_estimated_tax numeric(14,2) not null default 0,
  longevity_target_age numeric(6,2),
  projected_rmd_years numeric(6,2),
  reminder_preference text,
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_rmd_calendar_reports_user_created_at
  on public.rmd_calendar_reports (user_id, created_at desc);

create table if not exists public.rmd_deadline_reminders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id uuid not null references public.rmd_calendar_reports(id) on delete cascade,
  tool_slug text not null default 'rmd-calendar-tax-estimator',
  reminder_type text not null,
  target_deadline_date date not null,
  scheduled_for date not null,
  delivery_channel text,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb
);

create unique index if not exists idx_rmd_deadline_reminders_unique
  on public.rmd_deadline_reminders (user_id, tool_slug, reminder_type, target_deadline_date);

create index if not exists idx_rmd_deadline_reminders_schedule
  on public.rmd_deadline_reminders (scheduled_for, status);

alter table public.rmd_calendar_reports enable row level security;
alter table public.rmd_deadline_reminders enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'rmd_calendar_reports'
      and policyname = 'Users can view their own rmd calendar reports'
  ) then
    create policy "Users can view their own rmd calendar reports"
      on public.rmd_calendar_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'rmd_calendar_reports'
      and policyname = 'Users can insert their own rmd calendar reports'
  ) then
    create policy "Users can insert their own rmd calendar reports"
      on public.rmd_calendar_reports
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'rmd_deadline_reminders'
      and policyname = 'Users can view their own rmd reminders'
  ) then
    create policy "Users can view their own rmd reminders"
      on public.rmd_deadline_reminders
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'rmd_deadline_reminders'
      and policyname = 'Users can insert their own rmd reminders'
  ) then
    create policy "Users can insert their own rmd reminders"
      on public.rmd_deadline_reminders
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
