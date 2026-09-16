-- ============================================================================
-- ADD BUNDLES — run this once in Supabase's SQL Editor against your
-- existing project to add multi-game bundle support.
--
-- Safe to run even though your database already has games/profiles set up:
-- everything here only creates NEW objects (the `bundles` table and its
-- trigger/policies), it doesn't touch anything that already exists.
-- Requires the `is_admin()` function and `game_status` type from
-- schema.sql / fix-rls-recursion.sql to already exist, which they do if
-- you've been following along so far.
-- ============================================================================

create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  banner_image text,
  game_ids uuid[] not null default '{}',
  original_price numeric(10, 2) not null check (original_price >= 0),
  bundle_price numeric(10, 2) not null check (bundle_price >= 0),
  discount_percentage int not null default 0,
  savings numeric(10, 2) not null default 0,
  rating numeric(2, 1),
  featured boolean not null default false,
  status game_status not null default 'draft',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bundle_price_not_above_original check (bundle_price <= original_price)
);

create index if not exists bundles_status_idx on bundles(status);
create index if not exists bundles_featured_idx on bundles(featured);
create index if not exists bundles_slug_idx on bundles(slug);

create or replace function compute_bundle_discount()
returns trigger as $$
begin
  new.savings := greatest(new.original_price - new.bundle_price, 0);
  new.discount_percentage := case
    when new.original_price > 0
      then round((new.savings / new.original_price) * 100)
    else 0
  end;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bundles_discount_trigger on bundles;
create trigger bundles_discount_trigger
  before insert or update on bundles
  for each row execute procedure compute_bundle_discount();

alter table bundles enable row level security;

drop policy if exists "Public can read active bundles" on bundles;
create policy "Public can read active bundles"
  on bundles for select
  using (status = 'active');

drop policy if exists "Admins can read all bundles" on bundles;
create policy "Admins can read all bundles"
  on bundles for select
  using (public.is_admin());

drop policy if exists "Admins can insert bundles" on bundles;
create policy "Admins can insert bundles"
  on bundles for insert
  with check (public.is_admin());

drop policy if exists "Admins can update bundles" on bundles;
create policy "Admins can update bundles"
  on bundles for update
  using (public.is_admin());

drop policy if exists "Admins can delete bundles" on bundles;
create policy "Admins can delete bundles"
  on bundles for delete
  using (public.is_admin());
