-- Phase 7: Store a private, one-time capability for sending each order receipt.
-- Run after phase6_auth.sql. Orders are committed independently of email delivery.

create table if not exists public.order_confirmation_emails (
  order_id bigint primary key references public.orders (id) on delete cascade,
  delivery_token uuid not null unique default pg_catalog.gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'failed', 'sent')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  attempted_at timestamptz,
  sent_at timestamptz,
  expires_at timestamptz not null default (pg_catalog.now() + interval '7 days'),
  last_error_code text,
  created_at timestamptz not null default pg_catalog.now()
);

alter table public.order_confirmation_emails enable row level security;
alter table public.order_confirmation_emails force row level security;

-- Browser roles have no access or policies. The Edge Function uses the
-- server-side service-role client; that key must never enter the Vite bundle.
revoke all on table public.order_confirmation_emails from public, anon, authenticated;
grant select, update on table public.order_confirmation_emails to service_role;

-- Claim the email atomically so repeated requests cannot send a duplicate.
-- A stuck send can be retried after ten minutes; delivery tokens expire after
-- seven days. Only the private Edge Function's service-role client can execute it.
create or replace function public.claim_order_confirmation_email(
  p_order_id bigint,
  p_delivery_token uuid
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
  v_attempted_at timestamptz;
  v_expires_at timestamptz;
begin
  select status, attempted_at, expires_at
    into v_status, v_attempted_at, v_expires_at
    from public.order_confirmation_emails
    where order_id = p_order_id
      and delivery_token = p_delivery_token
    for update;

  if not found then
    return 'invalid';
  end if;

  if v_expires_at <= pg_catalog.now() then
    return 'expired';
  end if;

  if v_status = 'sent' then
    return 'sent';
  end if;

  if v_status = 'sending'
     and v_attempted_at is not null
     and v_attempted_at > pg_catalog.now() - interval '10 minutes' then
    return 'sending';
  end if;

  update public.order_confirmation_emails
    set status = 'sending',
        attempt_count = attempt_count + 1,
        attempted_at = pg_catalog.clock_timestamp(),
        sent_at = null,
        last_error_code = null
    where order_id = p_order_id;

  return 'claimed';
end;
$$;

revoke all on function public.claim_order_confirmation_email(bigint, uuid) from public, anon, authenticated;
grant execute on function public.claim_order_confirmation_email(bigint, uuid) to service_role;

-- Preserve Phase 5/6's secure order flow and database-side price calculation.
-- The one-time email capability is only returned after the order and line items
-- have been inserted in the same transaction.
create or replace function public.create_order(
  p_customer_name text,
  p_email text,
  p_address text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id bigint;
  v_total numeric(12, 2) := 0;
  v_item jsonb;
  v_product record;
  v_qty integer;
  v_pid bigint;
  v_line_total numeric(12, 2);
  v_created_at timestamptz;
  v_user_id uuid := auth.uid();
  v_email_token uuid;
begin
  if p_customer_name is null or pg_catalog.btrim(p_customer_name) = '' then
    raise exception 'Customer name is required.';
  end if;

  if p_email is null or pg_catalog.btrim(p_email) = '' then
    raise exception 'Email is required.';
  end if;

  if p_address is null or pg_catalog.btrim(p_address) = '' then
    raise exception 'Address is required.';
  end if;

  if p_items is null or pg_catalog.jsonb_array_length(p_items) = 0 then
    raise exception 'Cart must contain at least one item.';
  end if;

  -- Validate product IDs and calculate totals from trusted database prices.
  for v_item in select * from pg_catalog.jsonb_array_elements(p_items)
  loop
    v_pid := (v_item ->> 'product_id')::bigint;
    v_qty := (v_item ->> 'quantity')::integer;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Quantity must be a positive integer for product %.', v_pid;
    end if;

    select * into v_product from public.products where id = v_pid;
    if not found then
      raise exception 'Product with ID % does not exist.', v_pid;
    end if;

    v_line_total := v_product.price * v_qty;
    v_total := v_total + v_line_total;
  end loop;

  insert into public.orders (user_id, customer_name, email, address, total, status)
  values (
    v_user_id,
    pg_catalog.btrim(p_customer_name),
    pg_catalog.btrim(p_email),
    pg_catalog.btrim(p_address),
    v_total,
    'pending'
  )
  returning id, created_at into v_order_id, v_created_at;

  for v_item in select * from pg_catalog.jsonb_array_elements(p_items)
  loop
    v_pid := (v_item ->> 'product_id')::bigint;
    v_qty := (v_item ->> 'quantity')::integer;

    select price into v_product from public.products where id = v_pid;
    insert into public.order_items (order_id, product_id, quantity, price)
    values (v_order_id, v_pid, v_qty, v_product.price);
  end loop;

  insert into public.order_confirmation_emails (order_id)
  values (v_order_id)
  returning delivery_token into v_email_token;

  return pg_catalog.jsonb_build_object(
    'order_id', v_order_id,
    'customer_name', pg_catalog.btrim(p_customer_name),
    'email', pg_catalog.btrim(p_email),
    'total', v_total,
    'status', 'pending',
    'created_at', v_created_at,
    'email_confirmation_token', v_email_token
  );
end;
$$;

revoke all on function public.create_order(text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.create_order(text, text, text, jsonb) to anon, authenticated;