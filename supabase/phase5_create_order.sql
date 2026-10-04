-- =============================================================
-- Phase 5: Secure order creation function
-- Run this in the Supabase SQL Editor AFTER schema.sql + seed.sql
-- This does NOT modify existing tables or policies.
-- =============================================================

-- Allow anon and authenticated to call RPC functions.
-- (Supabase already grants EXECUTE on functions by default, but
-- we explicitly grant to be safe.)

-- Drop old version if re-running
drop function if exists public.create_order(text, text, text, jsonb);

create or replace function public.create_order(
  p_customer_name text,
  p_email         text,
  p_address       text,
  p_items         jsonb   -- array of { "product_id": <int>, "quantity": <int> }
)
returns jsonb
language plpgsql
security definer          -- runs as table owner → bypasses RLS
set search_path = public  -- best practice for SECURITY DEFINER
as $$
declare
  v_order_id    bigint;
  v_total       numeric(12,2) := 0;
  v_item        jsonb;
  v_product     record;
  v_qty         integer;
  v_pid         bigint;
  v_line_total  numeric(12,2);
  v_created_at  timestamptz;
begin
  -- ---- Input validation ----
  if p_customer_name is null or trim(p_customer_name) = '' then
    raise exception 'Customer name is required.';
  end if;

  if p_email is null or trim(p_email) = '' then
    raise exception 'Email is required.';
  end if;

  if p_address is null or trim(p_address) = '' then
    raise exception 'Address is required.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart must contain at least one item.';
  end if;

  -- ---- Pass 1: validate items and calculate total ----
  for v_item in select * from jsonb_array_elements(p_items)
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

  -- ---- Create order ----
  insert into public.orders (user_id, customer_name, email, address, total, status)
  values (null, trim(p_customer_name), trim(p_email), trim(p_address), v_total, 'pending')
  returning id, created_at into v_order_id, v_created_at;

  -- ---- Create order items ----
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_pid := (v_item ->> 'product_id')::bigint;
    v_qty := (v_item ->> 'quantity')::integer;

    select price into v_product from public.products where id = v_pid;

    insert into public.order_items (order_id, product_id, quantity, price)
    values (v_order_id, v_pid, v_qty, v_product.price);
  end loop;

  -- ---- Return order confirmation ----
  return jsonb_build_object(
    'order_id',      v_order_id,
    'customer_name', trim(p_customer_name),
    'email',         trim(p_email),
    'total',         v_total,
    'status',        'pending',
    'created_at',    v_created_at
  );
end;
$$;

-- Grant anon and authenticated permission to call this function.
grant execute on function public.create_order(text, text, text, jsonb)
  to anon, authenticated;
