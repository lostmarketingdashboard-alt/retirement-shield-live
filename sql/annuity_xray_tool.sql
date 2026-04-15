create extension if not exists pgcrypto;

create table if not exists public.annuity_xray_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  annuity_type text not null,
  input_mode text not null,
  contract_value numeric(14,2) not null default 0,
  gross_effective_yield_pct numeric(8,4) not null default 0,
  net_effective_yield_pct numeric(8,4) not null default 0,
  mortality_expense_fee_pct numeric(8,4) not null default 0,
  rider_fee_pct numeric(8,4) not null default 0,
  admin_fee_pct numeric(8,4) not null default 0,
  total_fee_pct numeric(8,4) not null default 0,
  surrender_years_remaining integer not null default 0,
  surrender_charge_pct numeric(8,4) not null default 0,
  annual_fee_drag numeric(14,2) not null default 0,
  matched_treasury_label text,
  matched_treasury_rate_pct numeric(8,4) not null default 0,
  modeled_cd_rate_pct numeric(8,4) not null default 0,
  modeled_bond_ladder_rate_pct numeric(8,4) not null default 0,
  opportunity_cost_annual numeric(14,2) not null default 0,
  lockup_cost_estimate numeric(14,2) not null default 0,
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_annuity_xray_reports_user_created_at
  on public.annuity_xray_reports (user_id, created_at desc);

alter table public.annuity_xray_reports enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'annuity_xray_reports'
      and policyname = 'Users can view their own annuity xray reports'
  ) then
    create policy "Users can view their own annuity xray reports"
      on public.annuity_xray_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'annuity_xray_reports'
      and policyname = 'Users can insert their own annuity xray reports'
  ) then
    create policy "Users can insert their own annuity xray reports"
      on public.annuity_xray_reports
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
