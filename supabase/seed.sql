-- Demo catalog data for Gamers Legion India.
-- Titles are used for realistic demo purposes only — this is not official
-- publisher pricing, and cover art is generated placeholder art, not real
-- box art. Run after schema.sql.

insert into games
  (title, slug, description, short_description, genre, platforms,
   original_price, sale_price, rating, review_count, release_date,
   deal_expiry, featured, status, tags)
values
  ('Black Myth: Wukong', 'black-myth-wukong',
   'An action RPG rooted in Chinese mythology, following a Destined One on a perilous journey filled with legendary beasts and ancient secrets.',
   'Mythic action RPG with punishing, spectacular boss fights.',
   array['Action','RPG','Adventure'], array['PC','PlayStation'],
   1399, 389, 4.8, 12400, '2024-08-20', now() + interval '3 days', true, 'active', array['souls-like','singleplayer']),

  ('Elden Ring', 'elden-ring',
   'A vast open-world action RPG shaped by Hidetaka Miyazaki and George R. R. Martin, set in the Lands Between.',
   'Open-world dark fantasy from the makers of Dark Souls.',
   array['Action','RPG','Adventure'], array['PC','PlayStation','Xbox'],
   2999, 1499, 4.9, 45210, '2022-02-25', null, true, 'active', array['open-world','souls-like']),

  ('Red Dead Redemption 2', 'red-dead-redemption-2',
   'An epic tale of life in America''s unforgiving heartland, following outlaw Arthur Morgan and the Van der Linde gang.',
   'Sprawling outlaw epic across the American frontier.',
   array['Action','Adventure'], array['PC','PlayStation','Xbox'],
   1999, 599, 4.9, 38900, '2019-11-05', now() + interval '1 day 14 hours', true, 'active', array['open-world','story-rich']),

  ('Cyberpunk 2077', 'cyberpunk-2077',
   'An open-world action-adventure set in Night City, a megalopolis obsessed with power, glamour and body modification.',
   'Neon-soaked open-world RPG in Night City.',
   array['Action','RPG'], array['PC','PlayStation','Xbox'],
   1999, 799, 4.6, 29800, '2020-12-10', now() + interval '2 days 6 hours', false, 'active', array['open-world','cyberpunk']),

  ('The Witcher 3: Wild Hunt', 'the-witcher-3-wild-hunt',
   'Play as Geralt of Rivia, a monster hunter for hire, in a war-torn world where every choice carries weight.',
   'Legendary open-world RPG following monster hunter Geralt.',
   array['RPG','Adventure'], array['PC','PlayStation','Xbox','Nintendo Switch'],
   1599, 319, 4.9, 52000, '2015-05-19', null, true, 'active', array['open-world','fantasy']),

  ('Hogwarts Legacy', 'hogwarts-legacy',
   'An immersive open-world action RPG set in the world of Harry Potter during the 1800s.',
   'Live your own wizarding-world adventure.',
   array['RPG','Adventure'], array['PC','PlayStation','Xbox'],
   2499, 999, 4.5, 21300, '2023-02-10', now() + interval '5 hours', false, 'active', array['open-world','magic']),

  ('God of War', 'god-of-war',
   'Kratos and his son Atreus journey through Norse realms in this cinematic action-adventure.',
   'Norse mythology reimagines the God of War saga.',
   array['Action','Adventure'], array['PC','PlayStation'],
   1999, 699, 4.9, 33200, '2022-01-14', null, false, 'active', array['story-rich','singleplayer']),

  ('Baldur''s Gate 3', 'baldurs-gate-3',
   'A party-based RPG set in the world of Dungeons & Dragons, full of choice-driven storytelling.',
   'Deep, choice-driven D&D role-playing at its best.',
   array['RPG','Strategy','Adventure'], array['PC','PlayStation'],
   2999, 2099, 4.9, 41000, '2023-08-03', now() + interval '4 days', true, 'active', array['co-op','turn-based']),

  ('Forza Horizon 5', 'forza-horizon-5',
   'Race, explore and collect over 500 cars across the vibrant, ever-evolving open world of Mexico.',
   'Open-world racing across vibrant Mexico.',
   array['Racing','Simulation'], array['PC','Xbox'],
   2499, 899, 4.7, 18700, '2021-11-09', now() + interval '18 hours', false, 'active', array['open-world','multiplayer']),

  ('Resident Evil Village', 'resident-evil-village',
   'Survive a nightmarish European village crawling with terrifying creatures in this first-person horror epic.',
   'First-person survival horror in a cursed village.',
   array['Horror','Action'], array['PC','PlayStation','Xbox'],
   1999, 599, 4.6, 15400, '2021-05-07', null, false, 'active', array['singleplayer','survival']),

  ('Assassin''s Creed Valhalla', 'assassins-creed-valhalla',
   'Lead epic Viking raids against Saxon armies and build your settlement in 9th-century England.',
   'Viking-age open-world action RPG.',
   array['Action','RPG','Adventure'], array['PC','PlayStation','Xbox'],
   1999, 499, 4.4, 22900, '2020-11-10', now() + interval '9 hours', false, 'active', array['open-world','historical']),

  ('Sekiro: Shadows Die Twice', 'sekiro-shadows-die-twice',
   'A stealth-action adventure set in a reimagined late-1500s Japan, following a disgraced shinobi.',
   'Unforgiving shinobi action from FromSoftware.',
   array['Action','Adventure'], array['PC','PlayStation','Xbox'],
   1999, 799, 4.8, 19600, '2019-03-22', null, false, 'active', array['souls-like','singleplayer']);
