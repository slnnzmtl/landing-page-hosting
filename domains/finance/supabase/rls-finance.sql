-- Run in Supabase SQL Editor (Dashboard → SQL).
-- Publishable/anon key gets 200 + [] when RLS is on without SELECT policies.

-- Ensure Data API roles can read these tables
grant select on table public.category to anon, authenticated;
grant select on table public.expense to anon, authenticated;

alter table public.category enable row level security;
alter table public.expense enable row level security;

drop policy if exists "anon_select_category" on public.category;
create policy "anon_select_category"
  on public.category
  for select
  to anon, authenticated
  using (true);

drop policy if exists "anon_select_expense" on public.expense;
create policy "anon_select_expense"
  on public.expense
  for select
  to anon, authenticated
  using (true);
