-- Run this AFTER you've created your admin account in the Supabase
-- Dashboard (Authentication -> Users -> Add user). There is no sign-up
-- form anywhere in the app on purpose — this is the only way an account
-- can become an admin.
-- Replace the email below with the one you created, then run this in
-- Supabase's SQL Editor.

update profiles
set role = 'admin'
where email = 'you@example.com';
