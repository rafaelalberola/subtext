-- Phase 2: Monetization schema additions
-- Run this in Supabase SQL Editor after Phase 1 schema is applied

-- analysis_events: records every analysis for usage counting
-- (separate from 'analyses' table which only stores saved analyses)
create table if not exists analysis_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

alter table analysis_events enable row level security;

drop policy if exists "Users can read own analysis events" on analysis_events;
create policy "Users can read own analysis events"
  on analysis_events for select using (auth.uid() = user_id);

-- Allow insert from authenticated users (via API route)
drop policy if exists "Users can insert own analysis events" on analysis_events;
create policy "Users can insert own analysis events"
  on analysis_events for insert with check (auth.uid() = user_id);

create index if not exists analysis_events_user_month
  on analysis_events(user_id, created_at desc);

-- user_subscriptions: Stripe subscription state
create table if not exists user_subscriptions (
  user_id uuid references auth.users(id) on delete cascade primary key,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text default 'free' check (plan in ('free', 'plus', 'pro')),
  billing_interval text check (billing_interval in ('monthly', 'annual')),
  status text default 'active' check (status in ('active', 'canceled', 'past_due')),
  bonus_credits integer default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_subscriptions enable row level security;

-- Users can only read their own subscription
drop policy if exists "Users can read own subscription" on user_subscriptions;
create policy "Users can read own subscription"
  on user_subscriptions for select using (auth.uid() = user_id);

-- No client-side insert/update/delete policies
-- All writes happen via Stripe webhooks using the service role key

create index if not exists user_subscriptions_stripe_customer
  on user_subscriptions(stripe_customer_id);

-- credit_purchases: one-time credit pack purchase history
create table if not exists credit_purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_payment_intent_id text unique,
  credits_amount integer not null,
  price_paid integer not null, -- in cents
  created_at timestamptz default now()
);

alter table credit_purchases enable row level security;

drop policy if exists "Users can read own credit purchases" on credit_purchases;
create policy "Users can read own credit purchases"
  on credit_purchases for select using (auth.uid() = user_id);
