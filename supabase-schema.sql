-- Subtext Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable RLS
alter table if exists analyses enable row level security;

-- Analyses table
create table if not exists analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  input_text text not null,
  input_type text default 'text' check (input_type in ('text', 'screenshot')),
  analysis_json jsonb not null,
  contact_label text,
  language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS policies (drop first for idempotency)
drop policy if exists "Users can read own analyses" on analyses;
create policy "Users can read own analyses"
  on analyses for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own analyses" on analyses;
create policy "Users can insert own analyses"
  on analyses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own analyses" on analyses;
create policy "Users can delete own analyses"
  on analyses for delete using (auth.uid() = user_id);

-- Index for fast queries
create index if not exists analyses_user_id_created_at on analyses(user_id, created_at desc);

-- Enable RLS on analyses
alter table analyses enable row level security;

-- User preferences
create table if not exists user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  ui_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop policy if exists "Users can read own preferences" on user_preferences;
create policy "Users can read own preferences"
  on user_preferences for select using (auth.uid() = user_id);

drop policy if exists "Users can upsert own preferences" on user_preferences;
create policy "Users can upsert own preferences"
  on user_preferences for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own preferences" on user_preferences;
create policy "Users can update own preferences"
  on user_preferences for update using (auth.uid() = user_id);

-- Enable RLS on user_preferences
alter table user_preferences enable row level security;

-- People table
create table if not exists people (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  avatar_emoji text default '👤',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table people enable row level security;

drop policy if exists "Users can read own people" on people;
create policy "Users can read own people"
  on people for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own people" on people;
create policy "Users can insert own people"
  on people for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own people" on people;
create policy "Users can update own people"
  on people for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own people" on people;
create policy "Users can delete own people"
  on people for delete using (auth.uid() = user_id);

create index if not exists people_user_id on people(user_id);

-- Add person_id to analyses
alter table analyses add column if not exists person_id uuid references people(id) on delete cascade;
create index if not exists analyses_person_id on analyses(person_id);
