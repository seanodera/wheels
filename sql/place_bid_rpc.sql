create or replace function public.place_bid(
  p_auction_id uuid,
  p_amount numeric
)
returns table (
  auction_id uuid,
  vehicle_id text,
  current_bid numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.auctions%rowtype;
  v_user_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Bid amount must be greater than zero';
  end if;

  select *
  into a
  from public.auctions
  where id = p_auction_id
  for update;

  if not found then
    raise exception 'Auction not found';
  end if;

  if a.status <> 'live' then
    raise exception 'Auction is not live';
  end if;

  if a.ending <= now() then
    raise exception 'Auction has ended';
  end if;

  if p_amount < a.current_bid + 50000 then
    raise exception 'Minimum bid is %', a.current_bid + 50000;
  end if;

  insert into public.auction_bids (
    auction_id,
    user_id,
    amount
  ) values (
    a.id,
    v_user_id,
    p_amount
  );

  update public.auctions
  set
    current_bid = p_amount,
    updated_at = now()
  where id = a.id;

  return query
  select
    a.id,
    a.vehicle_id,
    p_amount;
end;
$$;

grant execute on function public.place_bid(uuid, numeric) to authenticated;
