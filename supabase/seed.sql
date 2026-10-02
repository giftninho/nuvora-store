-- Nuvora Store starter catalog. Safe to re-run; IDs 1–6 are updated in place.

insert into public.products (id, name, description, price, image_url, created_at)
values
  (1, 'Classic T-Shirt', 'Crafted from 100% breathable organic cotton, this tailored-fit crewneck t-shirt offers versatile all-day comfort and timeless minimalism.', 18500, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', '2026-10-01T10:00:00Z'),
  (2, 'Classic Sneakers', 'Minimalist low-top street sneakers featuring cushioned ergonomic insoles and durable vulcanized rubber soles for effortless daily movement.', 45000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', '2026-10-01T10:05:00Z'),
  (3, 'Everyday Backpack', 'A weather-resistant canvas and vegan leather commuter backpack with a dedicated padded 15-inch laptop compartment and organized utility pockets.', 32000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', '2026-10-01T10:10:00Z'),
  (4, 'Minimalist Wristwatch', 'Sleek analog timepiece featuring a brushed stainless steel case, genuine leather strap, and precision quartz movement suited for any occasion.', 58000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', '2026-10-01T10:15:00Z'),
  (5, 'Premium Comfort Hoodie', 'Ultra-soft heavyweight fleece pullover with a double-lined drawstring hood, kangaroo front pocket, and ribbed cuffs for cozy warmth.', 38500, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', '2026-10-01T10:20:00Z'),
  (6, 'Classic Structured Cap', 'Six-panel premium cotton twill baseball cap with an adjustable brass buckle strap and embroidered ventilation eyelets for effortless style.', 12000, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', '2026-10-01T10:25:00Z')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  created_at = excluded.created_at;

-- Keep generated IDs above the explicit seed IDs.
select setval(
  pg_get_serial_sequence('public.products', 'id'),
  coalesce((select max(id) from public.products), 1),
  exists (select 1 from public.products)
);