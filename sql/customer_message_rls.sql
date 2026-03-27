alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

drop policy if exists "customers_can_insert_own_conversations" on public.conversations;
drop policy if exists "customers_can_select_own_conversations" on public.conversations;
drop policy if exists "customers_can_update_own_conversations" on public.conversations;

create policy "customers_can_insert_own_conversations"
on public.conversations
for insert
to authenticated
with check (
  customer_user_id = auth.uid()
  and (
    vehicle_id is null
    or exists (
      select 1
      from public.vehicles v
      where v.id = vehicle_id
        and v.seller_id = dealer_id
    )
  )
);

create policy "customers_can_select_own_conversations"
on public.conversations
for select
to authenticated
using (
  customer_user_id = auth.uid()
);

create policy "customers_can_update_own_conversations"
on public.conversations
for update
to authenticated
using (
  customer_user_id = auth.uid()
)
with check (
  customer_user_id = auth.uid()
);

drop policy if exists "customers_can_insert_participants_for_own_conversations" on public.conversation_participants;
drop policy if exists "customers_can_select_participants_for_own_conversations" on public.conversation_participants;
drop policy if exists "customers_can_update_own_participant_row" on public.conversation_participants;

create policy "customers_can_insert_participants_for_own_conversations"
on public.conversation_participants
for insert
to authenticated
with check (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
  )
);

create policy "customers_can_select_participants_for_own_conversations"
on public.conversation_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
  )
);

create policy "customers_can_update_own_participant_row"
on public.conversation_participants
for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
  )
);

drop policy if exists "customers_can_insert_messages_for_own_conversations" on public.messages;
drop policy if exists "customers_can_select_messages_for_own_conversations" on public.messages;
drop policy if exists "customers_can_update_own_messages" on public.messages;

create policy "customers_can_insert_messages_for_own_conversations"
on public.messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.conversations c
    join public.conversation_participants cp
      on cp.conversation_id = c.id
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
      and cp.id = sender_participant_id
      and cp.user_id = auth.uid()
      and cp.role = 'customer'
  )
);

create policy "customers_can_select_messages_for_own_conversations"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
  )
);

create policy "customers_can_update_own_messages"
on public.messages
for update
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    join public.conversation_participants cp
      on cp.conversation_id = c.id
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
      and cp.id = sender_participant_id
      and cp.user_id = auth.uid()
      and cp.role = 'customer'
  )
)
with check (
  exists (
    select 1
    from public.conversations c
    join public.conversation_participants cp
      on cp.conversation_id = c.id
    where c.id = conversation_id
      and c.customer_user_id = auth.uid()
      and cp.id = sender_participant_id
      and cp.user_id = auth.uid()
      and cp.role = 'customer'
  )
);
