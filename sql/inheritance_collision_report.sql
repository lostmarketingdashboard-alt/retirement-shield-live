create extension if not exists pgcrypto;

create table if not exists public.inheritance_collision_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  state_code text not null,
  state_name text not null,
  marital_status text not null,
  marriage_order text,
  current_marriage_children integer not null default 0,
  prior_marriage_children integer not null default 0,
  approximate_estate_size numeric(14,2) not null default 0,
  home_value numeric(14,2),
  scenario_key text,
  property_system text,
  collision_risk_score integer,
  spouse_share_pct numeric(8,4),
  descendants_share_pct numeric(8,4),
  elective_share_display text,
  state_rule_version text,
  state_rule_snapshot jsonb,
  report_title text,
  report_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_inheritance_collision_reports_user_created_at
  on public.inheritance_collision_reports (user_id, created_at desc);

create table if not exists public.inheritance_collision_state_rules (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  state_code text not null,
  state_name text not null,
  rule_version text not null default 'draft',
  is_active boolean not null default true,
  rules_payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_inheritance_collision_state_rules_state_code
  on public.inheritance_collision_state_rules (state_code, updated_at desc);

create unique index if not exists idx_inheritance_collision_state_rules_active_state
  on public.inheritance_collision_state_rules (state_code)
  where is_active = true;

alter table public.inheritance_collision_reports enable row level security;
alter table public.inheritance_collision_state_rules enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inheritance_collision_reports'
      and policyname = 'Users can view their own inheritance collision reports'
  ) then
    create policy "Users can view their own inheritance collision reports"
      on public.inheritance_collision_reports
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inheritance_collision_reports'
      and policyname = 'Users can insert their own inheritance collision reports'
  ) then
    create policy "Users can insert their own inheritance collision reports"
      on public.inheritance_collision_reports
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inheritance_collision_state_rules'
      and policyname = 'Public can read inheritance collision state rules'
  ) then
    create policy "Public can read inheritance collision state rules"
      on public.inheritance_collision_state_rules
      for select
      using (true);
  end if;
end $$;

comment on table public.inheritance_collision_state_rules is
'State-level blended-family inheritance snapshots consumed by the Inheritance Collision Report.';

comment on column public.inheritance_collision_state_rules.rules_payload is
'Expected shape: {"property_system":"common_law|community_property","intestacy":{"spouse_only":{"display":"","narrative":"","spouse_pct":1,"descendants_pct":0},"spouse_and_joint_descendants":{},"spouse_and_prior_descendants":{},"spouse_and_mixed_descendants":{},"unmarried_descendants":{}},"elective_share":{"label":"","display":"","narrative":""},"stepchildren":{"inherit_without_adoption":false,"display":""}}';
