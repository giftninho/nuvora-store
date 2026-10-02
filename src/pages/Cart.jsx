import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/currency';

export default function Cart() {
  const { cartItems, cartCount, subtotal } = useCart();
  const isEmpty = cartItems.length === 0;
  // No delivery fee or tax yet, so the total equals the subtotal.
  const total = subtotal;

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">Review your selected items before checking out.</p>
      </div>

      {isEmpty ? (
        <div className="card-placeholder">
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
            Looks like you have not added anything yet.
          </p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list" aria-label="Cart items">
            {cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </ul>

          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order Summary</h2>
            <dl className="summary-rows">
              <div className="summary-row">
                <dt>Items</dt>
                <dd>{cartCount}</dd>
              </div>
              <div className="summary-row">
                <dt>Subtotal</dt>
                <dd>{formatNaira(subtotal)}</dd>
              </div>
              <div className="summary-row summary-total">
                <dt>Total</dt>
                <dd>{formatNaira(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout</Link>
            <Link to="/" className="btn btn-outline btn-block">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
