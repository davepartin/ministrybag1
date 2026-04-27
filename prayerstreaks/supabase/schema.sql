create extension if not exists pgcrypto with schema extensions;

create or replace function public.invite_code()
returns text
language sql
set search_path = public, extensions
as $$
  select upper(substr(encode(extensions.gen_random_bytes(5), 'hex'), 1, 10));
$$;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  invite_code text not null default public.invite_code() unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.prayer_days (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  day date not null,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (household_id, day)
);

create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  note text not null default '' check (char_length(note) <= 700),
  answered_note text check (answered_note is null or char_length(answered_note) <= 700),
  answered_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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

drop trigger if exists prayers_set_updated_at on public.prayers;
create trigger prayers_set_updated_at
before update on public.prayers
for each row execute function public.set_updated_at();

alter table public.households
alter column invite_code set default public.invite_code();

update public.households
set invite_code = public.invite_code()
where invite_code is null
   or btrim(invite_code) = ''
   or upper(invite_code) = 'DEMO';

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = auth.uid()
  );
$$;

create or replace function public.create_household(room_name text)
returns public.households
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household public.households;
  code text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  loop
    code := public.invite_code();
    exit when not exists (select 1 from public.households where invite_code = code);
  end loop;

  insert into public.households (name, invite_code, owner_id)
  values (trim(room_name), code, auth.uid())
  returning * into new_household;

  insert into public.household_members (household_id, user_id, role)
  values (new_household.id, auth.uid(), 'owner');

  return new_household;
end;
$$;

create or replace function public.join_household_by_code(invite text)
returns public.households
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.households;
  normalized_invite text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  normalized_invite := upper(trim(invite));

  select *
  into target
  from public.households
  where upper(invite_code) = normalized_invite
     or upper(substr(replace(id::text, '-', ''), 1, 10)) = normalized_invite
  limit 1;

  if target.id is null then
    raise exception 'No prayer room found for that invite code.';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (target.id, auth.uid(), 'member')
  on conflict (household_id, user_id) do nothing;

  return target;
end;
$$;

create or replace function public.get_my_households()
returns setof public.households
language sql
security definer
set search_path = public
as $$
  select h.*
  from public.households h
  join public.household_members hm on hm.household_id = h.id
  where hm.user_id = auth.uid()
  order by hm.created_at asc;
$$;

create or replace function public.get_my_household()
returns public.households
language sql
security definer
set search_path = public
as $$
  select h.*
  from public.households h
  join public.household_members hm on hm.household_id = h.id
  where hm.user_id = auth.uid()
  order by hm.created_at asc
  limit 1;
$$;

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.prayer_days enable row level security;
alter table public.prayers enable row level security;

drop policy if exists "Members can view their household" on public.households;
create policy "Members can view their household"
on public.households for select
using (public.is_household_member(id));

drop policy if exists "Members can view room members" on public.household_members;
create policy "Members can view room members"
on public.household_members for select
using (public.is_household_member(household_id));

drop policy if exists "Members can view prayer days" on public.prayer_days;
create policy "Members can view prayer days"
on public.prayer_days for select
using (public.is_household_member(household_id));

drop policy if exists "Members can add prayer days" on public.prayer_days;
create policy "Members can add prayer days"
on public.prayer_days for insert
with check (public.is_household_member(household_id) and created_by = auth.uid());

drop policy if exists "Members can view prayers" on public.prayers;
create policy "Members can view prayers"
on public.prayers for select
using (public.is_household_member(household_id));

drop policy if exists "Members can add prayers" on public.prayers;
create policy "Members can add prayers"
on public.prayers for insert
with check (public.is_household_member(household_id) and created_by = auth.uid());

drop policy if exists "Members can update prayers" on public.prayers;
create policy "Members can update prayers"
on public.prayers for update
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

drop policy if exists "Members can delete prayers" on public.prayers;
create policy "Members can delete prayers"
on public.prayers for delete
using (public.is_household_member(household_id));

grant usage on schema public to anon, authenticated;
grant select on public.households to authenticated;
grant select on public.household_members to authenticated;
grant select, insert on public.prayer_days to authenticated;
grant select, insert, update, delete on public.prayers to authenticated;
grant execute on function public.create_household(text) to authenticated;
grant execute on function public.join_household_by_code(text) to authenticated;
grant execute on function public.get_my_households() to authenticated;
grant execute on function public.get_my_household() to authenticated;
grant execute on function public.is_household_member(uuid) to authenticated;

do $$
begin
  begin
    alter publication supabase_realtime add table public.prayers;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.prayer_days;
  exception
    when duplicate_object then null;
    when undefined_object then null;
  end;
end $$;
