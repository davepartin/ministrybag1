create extension if not exists pgcrypto with schema extensions;

create or replace function public.invite_code()
returns text
language sql
set search_path = public, extensions
as $$
  select upper(substr(encode(extensions.gen_random_bytes(5), 'hex'), 1, 10));
$$;

alter table public.households
add column if not exists invite_code text;

update public.households
set invite_code = public.invite_code()
where invite_code is null
   or btrim(invite_code) = ''
   or upper(invite_code) = 'DEMO';

alter table public.households
alter column invite_code set default public.invite_code();

alter table public.households
alter column invite_code set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'households_invite_code_key'
  ) then
    alter table public.households
    add constraint households_invite_code_key unique (invite_code);
  end if;
end $$;

notify pgrst, 'reload schema';

select id, name, invite_code, created_at
from public.households
order by created_at desc;
