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

grant execute on function public.create_household(text) to authenticated;
grant execute on function public.join_household_by_code(text) to authenticated;
grant execute on function public.get_my_households() to authenticated;

notify pgrst, 'reload schema';
