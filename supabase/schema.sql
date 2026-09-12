-- ============================================================================
-- GAMERS LEGION INDIA — Supabase schema
-- Run this in your Supabase project's SQL Editor (Project > SQL Editor > New query)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES  (extends Supabase's built-in auth.users with an app role)
-- ---------------------------------------------------------------------------
create type user_role as enum ('user', 'admin');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- Automatically create a profile row whenever someone signs up.
-- New accounts always start as 'user' — role is NEVER settable from the client.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- 2. GAMES
-- ---------------------------------------------------------------------------
create type game_status as enum ('active', 'draft', 'archived', 'expired');

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  short_description text,
  cover_image text,
  banner_image text,
  genre text[] not null default '{}',
  platforms text[] not null default '{}',
  original_price numeric(10, 2) not null check (original_price >= 0),
  sale_price numeric(10, 2) not null check (sale_price >= 0),
  discount_percentage int not null default 0,
  savings numeric(10, 2) not null default 0,
  rating numeric(2, 1),
  review_count int default 0,
  release_date date,
  deal_expiry timestamptz,
  featured boolean not null default false,
  status game_status not null default 'draft',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sale_not_above_original check (sale_price <= original_price)
);

create index if not exists games_status_idx on games(status);
create index if not exists games_featured_idx on games(featured);
create index if not exists games_slug_idx on games(slug);

-- Keep discount_percentage / savings in sync automatically so the admin
-- never has to type them in manually.
create or replace function compute_game_discount()
returns trigger as $$
begin
  new.savings := greatest(new.original_price - new.sale_price, 0);
  new.discount_percentage := case
    when new.original_price > 0
      then round((new.savings / new.original_price) * 100)
    else 0
  end;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists games_discount_trigger on games;
create trigger games_discount_trigger
  before insert or update on games
  for each row execute procedure compute_game_discount();

alter table games enable row level security;

-- Public (anon + authenticated) can only ever read ACTIVE games.
create policy "Public can read active games"
  on games for select
  using (status = 'active');

-- Admins can read every row regardless of status (drafts, archived, etc).
create policy "Admins can read all games"
  on games for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can insert games"
  on games for insert
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can update games"
  on games for update
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can delete games"
  on games for delete
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- 3. STORAGE (game cover/banner images)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('games', 'games', true)
on conflict (id) do nothing;

create policy "Public can view game images"
  on storage.objects for select
  using (bucket_id = 'games');

create policy "Admins can upload game images"
  on storage.objects for insert
  with check (
    bucket_id = 'games'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can update game images"
  on storage.objects for update
  using (
    bucket_id = 'games'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can delete game images"
  on storage.objects for delete
  using (
    bucket_id = 'games'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================================
-- After running this file:
-- 1. Sign up for an account through /admin/login (the "Sign up" link) using
--    the email you want to use as an administrator.
-- 2. Come back here and run promote-to-admin.sql (replacing the email) to
--    grant that account the 'admin' role.
-- ============================================================================
