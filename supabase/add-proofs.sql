-- ============================================================================
-- Adds the "Proof of Delivery" gallery — admin-uploaded screenshots showing
-- real completed sales, displayed publicly on /proof to build trust.
--
-- Run this ONCE in Supabase's SQL Editor against your existing project,
-- the same way you ran add-bundles.sql and fix-rls-recursion.sql earlier.
-- Reuses the existing `games` storage bucket (under a proofs/ prefix) and
-- the existing public.is_admin() function — no new bucket or function
-- needed.
-- ============================================================================

create table if not exists proofs (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  game_id uuid references games(id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table proofs enable row level security;

create policy "Public can view published proofs"
  on proofs for select
  using (published = true);

create policy "Admins can view all proofs"
  on proofs for select
  using (public.is_admin());

create policy "Admins can insert proofs"
  on proofs for insert
  with check (public.is_admin());

create policy "Admins can update proofs"
  on proofs for update
  using (public.is_admin());

create policy "Admins can delete proofs"
  on proofs for delete
  using (public.is_admin());
