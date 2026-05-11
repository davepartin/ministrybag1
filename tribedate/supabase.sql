create extension if not exists pgcrypto;

create table if not exists public.tribe_availability (
  id uuid primary key default gen_random_uuid(),
  calendar_code text not null default 'tribe',
  game_date date not null,
  person text not null,
  created_at timestamptz not null default now(),
  constraint tribe_calendar_code_check check (calendar_code = 'tribe'),
  constraint tribe_person_check check (person in ('Dave', 'Chris', 'Curtis', 'Brian', 'Silas', 'Joel')),
  constraint tribe_availability_unique unique (calendar_code, game_date, person)
);

alter table public.tribe_availability enable row level security;

drop policy if exists "tribe availability read" on public.tribe_availability;
drop policy if exists "tribe availability insert" on public.tribe_availability;
drop policy if exists "tribe availability delete" on public.tribe_availability;

create policy "tribe availability read"
on public.tribe_availability
for select
to anon
using (calendar_code = 'tribe');

create policy "tribe availability insert"
on public.tribe_availability
for insert
to anon
with check (
  calendar_code = 'tribe'
  and person in ('Dave', 'Chris', 'Curtis', 'Brian', 'Silas', 'Joel')
);

create policy "tribe availability delete"
on public.tribe_availability
for delete
to anon
using (
  calendar_code = 'tribe'
  and person in ('Dave', 'Chris', 'Curtis', 'Brian', 'Silas', 'Joel')
);

create index if not exists tribe_availability_date_idx
on public.tribe_availability (game_date);

do $$
begin
  alter publication supabase_realtime add table public.tribe_availability;
exception
  when duplicate_object or undefined_object then null;
end $$;
