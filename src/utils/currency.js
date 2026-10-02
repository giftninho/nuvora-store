/**
 * Formats a numeric price into Nigerian Naira (₦) currency string.
 * Example: 18500 -> "₦18,500"
 * 
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatNaira(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₦0';
  }
  return `₦${Math.round(amount).toLocaleString('en-US')}`;
}
