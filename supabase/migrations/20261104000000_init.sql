-- MedPlate initial schema. Every user table is protected by Row Level Security scoped to auth.uid().
-- Recipe and ingredient content is versioned in the repo (lib/data) and reviewed via pull request,
-- so only user data lives in Postgres.

create table public.profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb not null,               -- UserProfile (diets, CKD stage, labs, overrides, …)
  updated_at  timestamptz not null default now()
);

create table public.meal_plans (
  id          uuid primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  plan        jsonb not null,               -- WeekPlan incl. rulesSnapshot, so old plans stay explainable
  is_current  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index meal_plans_user_idx on public.meal_plans (user_id, created_at desc);
create unique index meal_plans_one_current on public.meal_plans (user_id) where is_current;

create table public.grocery_checks (
  plan_id        uuid not null references public.meal_plans (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  ingredient_id  text not null,
  primary key (plan_id, ingredient_id)
);

create table public.pantry_items (
  user_id        uuid not null references auth.users (id) on delete cascade,
  ingredient_id  text not null,
  primary key (user_id, ingredient_id)
);

create table public.favorites (
  user_id    uuid not null references auth.users (id) on delete cascade,
  recipe_id  text not null,
  primary key (user_id, recipe_id)
);

create table public.fodmap_challenges (
  user_id       uuid not null references auth.users (id) on delete cascade,
  challenge_id  text not null,
  started_on    date not null,
  result        text check (result in ('tolerated', 'trigger')),
  triggers      text[] not null default '{}',
  primary key (user_id, challenge_id)
);

create table public.symptom_logs (
  id            uuid primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  challenge_id  text not null,
  dose_day      smallint not null check (dose_day between 1 and 3),
  logged_on     date not null,
  severity      smallint not null check (severity between 0 and 10),
  symptoms      text[] not null default '{}',
  note          text
);
create index symptom_logs_user_idx on public.symptom_logs (user_id, logged_on);

-- Row Level Security: users can only see and change their own rows.
do $$
declare t text;
begin
  foreach t in array array['profiles','meal_plans','grocery_checks','pantry_items','favorites','fodmap_challenges','symptom_logs'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "own rows" on public.%I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
      t
    );
  end loop;
end $$;
