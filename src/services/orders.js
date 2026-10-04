import { getSupabaseClient } from '../lib/supabase';

/**
 * Validates checkout form fields on the client side.
 * Returns an object of field → error-message pairs.
 *
 * @param {{ customerName: string, email: string, address: string }} fields
 * @returns {Object} errors – empty if valid
 */
export function validateCheckoutFields({ customerName, email, address }) {
  const errors = {};

  if (!customerName || customerName.trim() === '') {
    errors.customerName = 'Full name is required.';
  }

  if (!email || email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!address || address.trim() === '') {
    errors.address = 'Delivery address is required.';
  }

  return errors;
}

/**
 * Creates an order via the secure Supabase RPC function `create_order`.
 *
 * The function receives plain customer details and cart items.  Trusted
 * product prices and the order total are calculated inside the database,
 * not in the browser.
 *
 * @param {{ customerName: string, email: string, address: string }} customer
 * @param {Array<{ product: { id: number|string }, quantity: number }>} cartItems
 * @returns {Promise<Object>} Confirmed order data returned by the database
 */
export async function placeOrder(customer, cartItems) {
  // Basic client-side sanity checks (the DB function also validates)
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Your cart is empty. Please add items before checking out.');
  }

  const items = cartItems.map((item) => {
    const productId = Number(item.product.id);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error(`Invalid product ID: ${item.product.id}`);
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for product "${item.product.name}".`);
    }

    return { product_id: productId, quantity };
  });

  const { data, error } = await getSupabaseClient().rpc('create_order', {
    p_customer_name: customer.customerName.trim(),
    p_email: customer.email.trim(),
    p_address: customer.address.trim(),
    p_items: items,
  });

  if (error) {
    // Surface the Postgres error message if available
    const message =
      error.message || 'An unexpected error occurred while placing your order.';
    throw new Error(message);
  }

  return data;
}
