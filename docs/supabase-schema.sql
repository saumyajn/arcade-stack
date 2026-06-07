create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  games_played integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.players(id) on delete cascade,
  game_id text not null,
  outcome text not null check (outcome in ('win', 'loss', 'draw', 'complete', 'played')),
  xp integer not null default 0,
  score integer,
  metadata jsonb not null default '{}'::jsonb,
  played_at timestamptz not null default now()
);

create index if not exists game_sessions_user_id_played_at_idx
  on public.game_sessions (user_id, played_at desc);

create index if not exists game_sessions_game_id_played_at_idx
  on public.game_sessions (game_id, played_at desc);

alter table public.players enable row level security;
alter table public.game_sessions enable row level security;

drop policy if exists "Players can read their own profile" on public.players;
create policy "Players can read their own profile"
  on public.players
  for select
  using (auth.uid() = id);

drop policy if exists "Players can upsert their own profile" on public.players;
create policy "Players can upsert their own profile"
  on public.players
  for insert
  with check (auth.uid() = id);

drop policy if exists "Players can update their own profile" on public.players;
create policy "Players can update their own profile"
  on public.players
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Players can read their own sessions" on public.game_sessions;
create policy "Players can read their own sessions"
  on public.game_sessions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Players can insert their own sessions" on public.game_sessions;
create policy "Players can insert their own sessions"
  on public.game_sessions
  for insert
  with check (auth.uid() = user_id);
