-- Notifications table for law change alerts
create table if not exists notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null default 'law_change',
    law_id text,
    event_type text,
    dismissed boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on notifications(user_id);
create index if not exists idx_notifications_law_id on notifications(law_id);

alter table notifications enable row level security;

create policy "Users can read their own notifications"
    on notifications for select
    using (auth.uid() = user_id);

create policy "Users can dismiss their own notifications"
    on notifications for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
