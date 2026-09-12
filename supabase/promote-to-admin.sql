-- Run this AFTER you've signed up for an account at /admin/login.
-- Replace the email below with the one you signed up with, then run
-- this in Supabase's SQL Editor.

update profiles
set role = 'admin'
where email = 'you@example.com';
