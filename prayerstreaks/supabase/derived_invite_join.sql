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

grant execute on function public.join_household_by_code(text) to authenticated;

notify pgrst, 'reload schema';
