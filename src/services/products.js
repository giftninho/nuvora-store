/**
 * Seed product catalog data and service functions for Nuvora Store.
 * In Phase 2, this provides local mock data. In Phase 4, this will be connected to Supabase.
 */

export const SEED_PRODUCTS = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    description: 'Crafted from 100% breathable organic cotton, this tailored-fit crewneck t-shirt offers versatile all-day comfort and timeless minimalism.',
    price: 18500,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Classic Sneakers',
    description: 'Minimalist low-top street sneakers featuring cushioned ergonomic insoles and durable vulcanized rubber soles for effortless daily movement.',
    price: 45000,
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-10-01T10:05:00Z',
  },
  {
    id: '3',
    name: 'Everyday Backpack',
    description: 'A weather-resistant canvas and vegan leather commuter backpack with a dedicated padded 15-inch laptop compartment and organized utility pockets.',
    price: 32000,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-10-01T10:10:00Z',
  },
  {
    id: '4',
    name: 'Minimalist Wristwatch',
    description: 'Sleek analog timepiece featuring a brushed stainless steel case, genuine leather strap, and precision quartz movement suited for any occasion.',
    price: 58000,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-10-01T10:15:00Z',
  },
  {
    id: '5',
    name: 'Premium Comfort Hoodie',
    description: 'Ultra-soft heavyweight fleece pullover with a double-lined drawstring hood, kangaroo front pocket, and ribbed cuffs for cozy warmth.',
    price: 38500,
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-10-01T10:20:00Z',
  },
  {
    id: '6',
    name: 'Classic Structured Cap',
    description: 'Six-panel premium cotton twill baseball cap with an adjustable brass buckle strap and embroidered ventilation eyelets for effortless style.',
    price: 12000,
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-10-01T10:25:00Z',
  },
];

/**
 * Fetch all available products
 * @returns {Promise<Array>} List of products
 */
export async function getProducts() {
  return Promise.resolve([...SEED_PRODUCTS]);
}

/**
 * Fetch a single product by ID
 * @param {string|number} id
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export async function getProductById(id) {
  const product = SEED_PRODUCTS.find((p) => String(p.id) === String(id));
  return Promise.resolve(product || null);
}
