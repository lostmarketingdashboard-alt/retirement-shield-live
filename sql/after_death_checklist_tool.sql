create extension if not exists pgcrypto;

create table if not exists public.after_death_checklist_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  state_code text not null,
  state_name text not null,
  has_will boolean not null default false,
  has_trust boolean not null default false,
  has_poa boolean not null default false,
  has_healthcare_proxy boolean not null default false,
  has_beneficiary_designations boolean not null default false,
  has_funeral_preplan boolean not null default false,
  has_digital_inventory boolean not null default false,
  readiness_score integer,
  death_certificate_copies text,
  will_deadline text,
  creditor_window text,
  state_rule_version text,
  state_rule_snapshot jsonb,
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_after_death_checklist_reports_user_created_at
  on public.after_death_checklist_reports (user_id, created_at desc);

create table if not exists public.after_death_checklist_state_rules (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  state_code text not null,
  state_name text not null,
  rule_version text not null default 'draft',
  is_active boolean not null default true,
  rules_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_after_death_checklist_state_rules_state_code
  on public.after_death_checklist_state_rules (state_code, updated_at desc);

create unique index if not exists idx_after_death_checklist_state_rules_active_state
  on public.after_death_checklist_state_rules (state_code)
  where is_active = true;

alter table public.after_death_checklist_reports enable row level security;
alter table public.after_death_checklist_state_rules enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'after_death_checklist_reports'
      and policyname = 'Users can view their own after death checklist reports'
  ) then
    create policy "Users can view their own after death checklist reports"
      on public.after_death_checklist_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'after_death_checklist_reports'
      and policyname = 'Users can insert their own after death checklist reports'
  ) then
    create policy "Users can insert their own after death checklist reports"
      on public.after_death_checklist_reports
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'after_death_checklist_state_rules'
      and policyname = 'Public can read after death checklist state rules'
  ) then
    create policy "Public can read after death checklist state rules"
      on public.after_death_checklist_state_rules
      for select
      using (true);
  end if;
end $$;

comment on table public.after_death_checklist_state_rules is
'State-level post-death administration reminders consumed by the 72-Hour Checklist tool.';

comment on column public.after_death_checklist_state_rules.rules_payload is
'Expected keys: death_certificate_copies, will_deadline, creditor_window, probate_urgency, account_access, funeral_note, rule_label.';
