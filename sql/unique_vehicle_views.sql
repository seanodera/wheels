-- Count vehicle views once per unique viewer.
-- Authenticated users are deduped by user_id. Anonymous users are deduped by
-- PostHog distinct ID stored in vehicle_events.metadata->>'posthog_distinct_id'.

delete from public.vehicle_events duplicate
using public.vehicle_events original
where duplicate.event_type = 'view'
  and original.event_type = 'view'
  and duplicate.vehicle_id = original.vehicle_id
  and duplicate.user_id is not null
  and duplicate.user_id = original.user_id
  and (
    duplicate.created_at > original.created_at
    or (duplicate.created_at = original.created_at and duplicate.id > original.id)
  );

delete from public.vehicle_events duplicate
using public.vehicle_events original
where duplicate.event_type = 'view'
  and original.event_type = 'view'
  and duplicate.vehicle_id = original.vehicle_id
  and duplicate.user_id is null
  and original.user_id is null
  and duplicate.metadata->>'posthog_distinct_id' is not null
  and duplicate.metadata->>'posthog_distinct_id' = original.metadata->>'posthog_distinct_id'
  and (
    duplicate.created_at > original.created_at
    or (duplicate.created_at = original.created_at and duplicate.id > original.id)
  );

create unique index if not exists vehicle_events_unique_auth_view_idx
on public.vehicle_events (vehicle_id, user_id)
where event_type = 'view' and user_id is not null;

create unique index if not exists vehicle_events_unique_posthog_view_idx
on public.vehicle_events (vehicle_id, (metadata->>'posthog_distinct_id'))
where event_type = 'view'
  and user_id is null
  and metadata->>'posthog_distinct_id' is not null;

update public.vehicles vehicle
set views = unique_views.views
from (
  select vehicle_id, count(*)::integer as views
  from public.vehicle_events
  where event_type = 'view'
  group by vehicle_id
) unique_views
where vehicle.id = unique_views.vehicle_id;

create or replace function public.record_vehicle_view(
  p_vehicle_id text,
  p_dealer_id text,
  p_user_id uuid default null,
  p_posthog_distinct_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_user_id uuid := coalesce(auth.uid(), p_user_id);
  event_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  inserted_count integer := 0;
  next_views integer := 0;
begin
  if p_vehicle_id is null or p_dealer_id is null then
    return jsonb_build_object('inserted', false, 'views', null);
  end if;

  if viewer_user_id is null and nullif(p_posthog_distinct_id, '') is null then
    select count(*)::integer
    into next_views
    from public.vehicle_events
    where vehicle_id = p_vehicle_id
      and event_type = 'view';

    return jsonb_build_object('inserted', false, 'views', next_views);
  end if;

  if nullif(p_posthog_distinct_id, '') is not null then
    event_metadata := event_metadata || jsonb_build_object('posthog_distinct_id', p_posthog_distinct_id);
  end if;

  insert into public.vehicle_events (
    vehicle_id,
    dealer_id,
    event_type,
    user_id,
    metadata
  )
  select
    p_vehicle_id,
    p_dealer_id,
    'view',
    viewer_user_id,
    event_metadata
  where exists (
    select 1
    from public.vehicles
    where id = p_vehicle_id
      and seller_id = p_dealer_id
  )
  on conflict do nothing;

  get diagnostics inserted_count = row_count;

  select count(*)::integer
  into next_views
  from public.vehicle_events
  where vehicle_id = p_vehicle_id
    and event_type = 'view';

  update public.vehicles
  set views = next_views
  where id = p_vehicle_id;

  return jsonb_build_object(
    'inserted', inserted_count > 0,
    'views', next_views
  );
end;
$$;

grant execute on function public.record_vehicle_view(text, text, uuid, text, jsonb) to anon, authenticated;
