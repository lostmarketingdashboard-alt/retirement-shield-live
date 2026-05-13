create table if not exists public.portal_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all' check (audience in ('all', 'user', 'admin', 'referral')),
  recipient_user_id uuid references public.profiles(id) on delete cascade,
  send_at timestamptz,
  repeat_interval text not null default 'none' check (repeat_interval in ('none', 'daily', 'weekly', 'monthly')),
  repeat_until timestamptz,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_notification_dismissals (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.portal_notifications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  occurrence_key text not null,
  dismissed_at timestamptz not null default now(),
  unique(notification_id, user_id, occurrence_key)
);

create index if not exists portal_notifications_active_send_idx
  on public.portal_notifications(active, send_at);

create index if not exists portal_notifications_recipient_idx
  on public.portal_notifications(recipient_user_id);

create index if not exists portal_notification_dismissals_user_idx
  on public.portal_notification_dismissals(user_id, notification_id);

alter table public.portal_notifications enable row level security;
alter table public.portal_notification_dismissals enable row level security;

drop policy if exists "Admins manage portal notifications" on public.portal_notifications;
create policy "Admins manage portal notifications"
  on public.portal_notifications
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "Users read relevant portal notifications" on public.portal_notifications;
create policy "Users read relevant portal notifications"
  on public.portal_notifications
  for select
  using (
    active = true
    and (
      recipient_user_id = auth.uid()
      or (
        recipient_user_id is null
        and audience in (
          'all',
          coalesce((select role from public.profiles where id = auth.uid()), 'user')
        )
      )
    )
  );

drop policy if exists "Users request consultant assignment notifications" on public.portal_notifications;
create policy "Users request consultant assignment notifications"
  on public.portal_notifications
  for insert
  with check (
    created_by = auth.uid()
    and audience = 'admin'
    and recipient_user_id is null
    and repeat_interval = 'none'
    and active = true
    and title = 'Consultant assignment requested'
  );

drop policy if exists "Users manage own notification dismissals" on public.portal_notification_dismissals;
create policy "Users manage own notification dismissals"
  on public.portal_notification_dismissals
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
