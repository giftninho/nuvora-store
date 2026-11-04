-- Phase 6: Associate authenticated orders with the verified Supabase user.
-- Run after schema.sql, seed.sql, and phase5_create_order.sql.
-- Guest checkout remains available and creates orders with user_id = NULL.

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Browser clients cannot write order records directly. The SECURITY DEFINER
-- create_order RPC remains the only order-creation path.
revoke all on table public.orders, public.order_items from anon, authenticated;
grant select on table public.orders, public.order_items to authenticated;

drop policy if exists "Users can read their own orders" on public.orders;
create policy "Users can read their own orders"
  on public.orders
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Users can read items from their own orders" on public.order_items;
create policy "Users can read items from their own orders"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

-- Keep the Phase 5 API and trusted database-side price calculation intact.
-- The user ID comes from the verified JWT, never from a browser parameter.
create or replace function public.create_order(
  p_customer_name text,
  p_email text,
  p_address text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
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
begin
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

  -- Validate products and calculate the total from database prices.
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

  insert into public.orders (user_id, customer_name, email, address, total, status)
  values (v_user_id, trim(p_customer_name), trim(p_email), trim(p_address), v_total, 'pending')
  returning id, created_at into v_order_id, v_created_at;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_pid := (v_item ->> 'product_id')::bigint;
    v_qty := (v_item ->> 'quantity')::integer;

    select price into v_product from public.products where id = v_pid;
    insert into public.order_items (order_id, product_id, quantity, price)
    values (v_order_id, v_pid, v_qty, v_product.price);
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'customer_name', trim(p_customer_name),
    'email', trim(p_email),
    'total', v_total,
    'status', 'pending',
    'created_at', v_created_at
  );
end;
$$;

revoke all on function public.create_order(text, text, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, jsonb) to anon, authenticated;