-- Run this in your Supabase SQL editor to add the hero-card toggle.
alter table games
  add column if not exists show_in_hero boolean not null default false;

-- Optional: index for fast lookups on the homepage.
create index if not exists games_show_in_hero_idx on games (show_in_hero)
  where status = 'active';
