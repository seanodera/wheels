drop view if exists public.newly_listed_feed;

create view public.newly_listed_feed as
select
    'listing'::text as type,
    l.id,
    l.price,
    l.negotiable,
    null::numeric as starting_bid,
    null::numeric as current_bid,
    null::numeric as reserve_price,
    null::timestamptz as ending,
    null::bigint as total_bids,
    (
        to_jsonb(v) ||
        jsonb_build_object(
            'type', 'listing',
            'seller', to_jsonb(d)
        )
    ) as vehicle,
    v.created_at
from public.listings l
join public.vehicles v on v.id = l.vehicle_id
join public.dealerships d on d.id = v.seller_id
where v.published = true

union all

select
    'auction'::text as type,
    a.id,
    null::numeric as price,
    false as negotiable,
    a.starting_bid,
    a.current_bid,
    a.reserve_price,
    a.ending,
    null::bigint as total_bids,
    (
        to_jsonb(v) ||
        jsonb_build_object(
            'type', 'auction',
            'seller', to_jsonb(d)
        )
    ) as vehicle,
    v.created_at
from public.auctions a
join public.vehicles v on v.id = a.vehicle_id
join public.dealerships d on d.id = v.seller_id
where v.published = true;
