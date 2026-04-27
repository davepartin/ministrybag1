create or replace function public.delete_household(target_household_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  if not exists (
    select 1
    from public.households h
    where h.id = target_household_id
      and h.owner_id = auth.uid()
  ) then
    raise exception 'Only the room creator can delete this prayer room.';
  end if;

  delete from public.households h
  where h.id = target_household_id
    and h.owner_id = auth.uid();
end;
$$;

grant execute on function public.delete_household(uuid) to authenticated;

notify pgrst, 'reload schema';
