-- ============================================================================
-- FIX: "infinite recursion detected in policy for relation profiles" (42P17)
--
-- Root cause: the "Admins can view all profiles" policy (and several games/
-- storage policies) checked admin status with:
--   exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
-- Since that subquery reads FROM profiles, and profiles itself is RLS-
-- protected, Postgres has to re-evaluate profiles' own policies to run the
-- subquery — including this same policy — forever.
--
-- Fix: move the check into a SECURITY DEFINER function. That runs with the
-- function owner's privileges instead of the calling user's, so its internal
-- read of `profiles` bypasses RLS entirely and the recursion is broken.
--
-- Run this ONCE in Supabase's SQL Editor against your existing project.
-- It's safe to run even if some of these policies don't exist yet.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin());

drop policy if exists "Admins can read all games" on games;
create policy "Admins can read all games"
  on games for select
  using (public.is_admin());

drop policy if exists "Admins can insert games" on games;
create policy "Admins can insert games"
  on games for insert
  with check (public.is_admin());

drop policy if exists "Admins can update games" on games;
create policy "Admins can update games"
  on games for update
  using (public.is_admin());

drop policy if exists "Admins can delete games" on games;
create policy "Admins can delete games"
  on games for delete
  using (public.is_admin());

drop policy if exists "Admins can upload game images" on storage.objects;
create policy "Admins can upload game images"
  on storage.objects for insert
  with check (bucket_id = 'games' and public.is_admin());

drop policy if exists "Admins can update game images" on storage.objects;
create policy "Admins can update game images"
  on storage.objects for update
  using (bucket_id = 'games' and public.is_admin());

drop policy if exists "Admins can delete game images" on storage.objects;
create policy "Admins can delete game images"
  on storage.objects for delete
  using (bucket_id = 'games' and public.is_admin());
