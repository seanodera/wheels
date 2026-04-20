-- Auction watches are users who want notifications for an auction.
-- One authenticated user can watch a given auction once.

create table if not exists public.user_auction_watches (
  user_id uuid not null references auth.users(id) on delete cascade,
  auction_id uuid not null references public.auctions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, auction_id)
);

alter table public.user_auction_watches enable row level security;

drop policy if exists user_auction_watches_select_own on public.user_auction_watches;
create policy user_auction_watches_select_own
on public.user_auction_watches
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists user_auction_watches_insert_own on public.user_auction_watches;
create policy user_auction_watches_insert_own
on public.user_auction_watches
for insert
to authenticated
with check (user_id = auth.uid());

create unique index if not exists vehicle_events_unique_auth_watch_idx
on public.vehicle_events (vehicle_id, user_id)
where event_type = 'watch' and user_id is not null;

create or replace function public.record_auction_watch(
  p_auction_id uuid,
  p_vehicle_id text,
  p_dealer_id text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_user_id uuid := auth.uid();
  inserted_count integer := 0;
  next_watch_count integer := 0;
begin
  if viewer_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_auction_id is null or p_vehicle_id is null or p_dealer_id is null then
    return jsonb_build_object('inserted', false, 'watch_count', 0);
  end if;

  insert into public.user_auction_watches (
    user_id,
    auction_id
  )
  select
    viewer_user_id,
    p_auction_id
  where exists (
    select 1
    from public.auctions auction
    join public.vehicles vehicle on vehicle.id = auction.vehicle_id
    where auction.id = p_auction_id
      and auction.vehicle_id = p_vehicle_id
      and vehicle.seller_id = p_dealer_id
      and vehicle.published = true
  )
  on conflict do nothing;

  get diagnostics inserted_count = row_count;

  if inserted_count > 0 then
    insert into public.vehicle_events (
      vehicle_id,
      dealer_id,
      event_type,
      user_id,
      metadata
    ) values (
      p_vehicle_id,
      p_dealer_id,
      'watch',
      viewer_user_id,
      coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('auction_id', p_auction_id)
    )
    on conflict do nothing;
  end if;

  select count(*)::integer
  into next_watch_count
  from public.user_auction_watches
  where auction_id = p_auction_id;

  return jsonb_build_object(
    'inserted', inserted_count > 0,
    'watch_count', next_watch_count
  );
end;
$$;

grant execute on function public.record_auction_watch(uuid, text, text, jsonb) to authenticated;
