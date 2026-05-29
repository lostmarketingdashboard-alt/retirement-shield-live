create extension if not exists pgcrypto;

create table if not exists public.page_traffic_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page_path text not null,
  normalized_path text not null,
  page_title text,
  referrer text,
  state_slug text,
  state_name text,
  county_slug text,
  county_name text,
  visitor_id text,
  session_id text,
  device_type text,
  source text,
  medium text,
  campaign text,
  user_agent text
);

create index if not exists idx_page_traffic_events_created_at
  on public.page_traffic_events (created_at desc);

create index if not exists idx_page_traffic_events_path_created
  on public.page_traffic_events (normalized_path, created_at desc);

create index if not exists idx_page_traffic_events_state_created
  on public.page_traffic_events (state_slug, created_at desc);

create index if not exists idx_page_traffic_events_county_created
  on public.page_traffic_events (state_slug, county_slug, created_at desc);

alter table public.page_traffic_events enable row level security;

drop policy if exists "Admins can read traffic events" on public.page_traffic_events;
create policy "Admins can read traffic events"
  on public.page_traffic_events
  for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

grant select on public.page_traffic_events to authenticated;
