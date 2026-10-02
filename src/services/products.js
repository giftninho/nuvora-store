import { getSupabaseClient } from '../lib/supabase';

/**
 * Fetch all available products
 * @returns {Promise<Array>} List of products
 */
export async function getProducts() {
  const { data, error } = await getSupabaseClient()
    .from('products')
    .select('id, name, description, price, image_url, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Fetch a single product by ID
 * @param {string|number} id
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export async function getProductById(id) {
  const { data, error } = await getSupabaseClient()
    .from('products')
    .select('id, name, description, price, image_url, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
