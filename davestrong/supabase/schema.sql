create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  birthday date,
  height_inches integer,
  starting_weight numeric,
  protein_target integer default 130,
  primary_goal text,
  back_history text,
  shoulder_history text,
  equipment text[],
  training_days text[],
  units text default 'pounds/inches',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  date date,
  weight numeric,
  waist numeric,
  sleep_hours numeric,
  energy integer,
  mood integer,
  stress integer,
  back_pain integer,
  shoulder_pain integer,
  leg_symptoms boolean default false,
  walking_minutes integer,
  steps integer,
  protein_grams integer,
  calories integer,
  water_ounces integer,
  workout_completed boolean default false,
  mobility_completed boolean default false,
  notes text,
  readiness_score integer,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  date date,
  meal_type text,
  food_name text,
  protein_grams integer,
  calories integer,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  date date,
  workout_type text,
  completed boolean default false,
  overall_rpe integer,
  back_pain_before integer,
  back_pain_after integer,
  shoulder_pain_before integer,
  shoulder_pain_after integer,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.workout_exercise_logs (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references public.workouts(id) on delete cascade,
  exercise_name text,
  sets integer,
  reps integer,
  weight numeric,
  duration_seconds integer,
  side text,
  pain integer,
  rpe integer,
  completed boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.strength_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  test_date date,
  test_name text,
  value numeric,
  value_secondary numeric,
  unit text,
  quality text,
  pain integer,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  goal_name text,
  current_value numeric,
  first_target numeric,
  strong_target numeric,
  unit text,
  category text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, goal_name)
);

create table if not exists public.exercise_library (
  id uuid primary key default gen_random_uuid(),
  name text unique,
  category text,
  why_it_matters text,
  instructions text,
  safety_notes text,
  common_mistakes text,
  regression text,
  progression text,
  created_at timestamp with time zone default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.food_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercise_logs enable row level security;
alter table public.strength_tests enable row level security;
alter table public.goals enable row level security;
alter table public.exercise_library enable row level security;

drop policy if exists "Profiles are owned by the signed-in user" on public.profiles;
create policy "Profiles are owned by the signed-in user"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Daily check-ins are owned by the signed-in user" on public.daily_checkins;
create policy "Daily check-ins are owned by the signed-in user"
on public.daily_checkins
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Food entries are owned by the signed-in user" on public.food_entries;
create policy "Food entries are owned by the signed-in user"
on public.food_entries
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Workouts are owned by the signed-in user" on public.workouts;
create policy "Workouts are owned by the signed-in user"
on public.workouts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Workout exercise logs are owned through workouts" on public.workout_exercise_logs;
create policy "Workout exercise logs are owned through workouts"
on public.workout_exercise_logs
for all
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercise_logs.workout_id
      and workouts.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercise_logs.workout_id
      and workouts.user_id = auth.uid()
  )
);

drop policy if exists "Strength tests are owned by the signed-in user" on public.strength_tests;
create policy "Strength tests are owned by the signed-in user"
on public.strength_tests
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Goals are owned by the signed-in user" on public.goals;
create policy "Goals are owned by the signed-in user"
on public.goals
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Exercise library is readable by authenticated users" on public.exercise_library;
create policy "Exercise library is readable by authenticated users"
on public.exercise_library
for select
to authenticated
using (true);
