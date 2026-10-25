-- Keleier Breiz hag ar Bed: paid subscriptions (Stripe).
-- Paste this whole file into Supabase → SQL Editor → New query, then click "Run".
-- Run it once, after supabase/schema.sql.
--
-- Readers can only READ their own rows. Nothing here can be written by a
-- reader: only the website's server (with the service role key, which
-- bypasses these rules) writes, after Stripe confirms a payment.

-- 1. Which Stripe customer belongs to which reader.
create table public.stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Subscriptions, as last reported by Stripe.
create table public.subscriptions (
  stripe_subscription_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  price_id text,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);

-- 3. Stripe events already handled, so a repeated event is ignored.
create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- 4. Editors (the site owner and writers) always see the full text.
-- Add people from the SQL Editor, like moderators.
create table public.editors (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- 5. Who can do what (row level security).
alter table public.stripe_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security;
alter table public.editors enable row level security;

create policy "Readers see their own Stripe customer" on public.stripe_customers
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Readers see their own subscriptions" on public.subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Editors see their own editor status" on public.editors
  for select to authenticated using ((select auth.uid()) = user_id);
-- stripe_events: no policy at all, so only the server can read or write it.

revoke insert, update, delete on public.stripe_customers, public.subscriptions, public.stripe_events, public.editors
  from anon, authenticated;
