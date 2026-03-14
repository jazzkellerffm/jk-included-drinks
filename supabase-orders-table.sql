-- Run this in Supabase SQL Editor to create the orders table for the JK Drinks MVP.
-- Then configure RLS if needed (e.g. allow anon to select/insert/update for the app).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_number text not null,
  access_code text not null,
  guest_name text,
  items jsonb not null default '[]',
  drink_count integer not null default 0,
  status text not null default 'open' check (status in ('open', 'served')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists orders_status_created_at on public.orders (status, created_at desc);
create index if not exists orders_table_access on public.orders (table_number, access_code);

-- Optional: allow anon key to read/write for the app (simplest for MVP).
-- alter table public.orders enable row level security;
-- create policy "Allow anon read write" on public.orders for all using (true) with check (true);

-- Add orders to realtime publication (run after table exists).
alter publication supabase_realtime add table public.orders;
