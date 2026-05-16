-- Run in Supabase SQL Editor after public.orders exists.
-- Per-device redemption: included drinks are counted per session_id + access_code (not per table).

alter table public.orders add column if not exists session_id text;

create index if not exists orders_session_access_created
  on public.orders (session_id, access_code, created_at desc);

comment on column public.orders.session_id is 'Client-generated redemption id (UUID); limits included drinks per session, not per table.';
