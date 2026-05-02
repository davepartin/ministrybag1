-- Allow members of a prayer room to unmark (delete) prayer days.
-- Run this once in the Supabase SQL editor for your project.

drop policy if exists "Members can delete prayer days" on public.prayer_days;
create policy "Members can delete prayer days"
on public.prayer_days for delete
using (public.is_household_member(household_id));

grant delete on public.prayer_days to authenticated;
