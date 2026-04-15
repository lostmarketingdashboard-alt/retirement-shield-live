create extension if not exists pgcrypto;

create table if not exists public.dividend_watch_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  portfolio_label text,
  holdings_count integer not null default 0,
  annual_dividend_income numeric(14,2) not null default 0,
  average_monthly_income numeric(14,2) not null default 0,
  dividend_health_score integer,
  top_income_ticker text,
  top_income_concentration_pct numeric(8,4),
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_dividend_watch_reports_user_created_at
  on public.dividend_watch_reports (user_id, created_at desc);

alter table public.dividend_watch_reports enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dividend_watch_reports'
      and policyname = 'Users can view their own dividend watch reports'
  ) then
    create policy "Users can view their own dividend watch reports"
      on public.dividend_watch_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dividend_watch_reports'
      and policyname = 'Users can insert their own dividend watch reports'
  ) then
    create policy "Users can insert their own dividend watch reports"
      on public.dividend_watch_reports
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
