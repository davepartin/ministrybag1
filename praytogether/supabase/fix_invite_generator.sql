create extension if not exists pgcrypto with schema extensions;

create or replace function public.invite_code()
returns text
language sql
set search_path = public, extensions
as $$
  select upper(substr(encode(extensions.gen_random_bytes(5), 'hex'), 1, 10));
$$;

alter table public.households
alter column invite_code set default public.invite_code();

notify pgrst, 'reload schema';
