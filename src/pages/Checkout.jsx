import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/currency';
import { validateCheckoutFields, placeOrder } from '../services/orders';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard against duplicate submissions (survives re-renders)
  const submittingRef = useRef(false);

  const isEmpty = cartItems.length === 0;

  useEffect(() => {
    if (!user) return;
    setCustomerName((current) => current || user.user_metadata?.full_name || '');
    setEmail((current) => current || user.email || '');
  }, [user]);

  // ---- Empty cart view ----
  if (isEmpty) {
    return (
      <div className="checkout-page">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
        </div>
        <div className="card-placeholder">
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
            Add some products before checking out.
          </p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  // ---- Form submission ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate calls
    if (submittingRef.current) return;

    // Client-side validation
    const fieldErrors = validateCheckoutFields({ customerName, email, address });
    setErrors(fieldErrors);
    setSubmitError('');

    if (Object.keys(fieldErrors).length > 0) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const orderData = await placeOrder(
        { customerName, email, address },
        cartItems
      );

      // Order succeeded → clear cart, navigate with real data
      clearCart();
      navigate('/order-success', {
        state: {
          orderId: orderData.order_id,
          customerName: orderData.customer_name,
          email: orderData.email,
          total: orderData.total,
          createdAt: orderData.created_at,
        },
        replace: true, // prevent Back-button re-submit
      });
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Complete your details to place your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="checkout-layout">
        {/* ---- Customer details ---- */}
        <div className="checkout-form-card">
          <h2 className="checkout-section-title">Delivery Details</h2>

          <div className="form-group">
            <label htmlFor="checkout-name" className="form-label">Full Name</label>
            <input
              id="checkout-name"
              type="text"
              className={`form-input${errors.customerName ? ' form-input-error' : ''}`}
              placeholder="e.g. Chioma Adebayo"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.customerName && (
              <p className="form-error" role="alert">{errors.customerName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-email" className="form-label">Email</label>
            <input
              id="checkout-email"
              type="email"
              className={`form-input${errors.email ? ' form-input-error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <p className="form-error" role="alert">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-address" className="form-label">Delivery Address</label>
            <textarea
              id="checkout-address"
              className={`form-input form-textarea${errors.address ? ' form-input-error' : ''}`}
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              autoComplete="street-address"
            />
            {errors.address && (
              <p className="form-error" role="alert">{errors.address}</p>
            )}
          </div>
        </div>

        {/* ---- Order summary ---- */}
        <aside className="checkout-summary" aria-label="Order summary">
          <h2 className="checkout-section-title">Order Summary</h2>

          <ul className="checkout-items-list">
            {cartItems.map((item) => (
              <li key={item.product.id} className="checkout-summary-item">
                <div className="checkout-summary-item-info">
                  <span className="checkout-summary-item-name">{item.product.name}</span>
                  <span className="checkout-summary-item-qty">×{item.quantity}</span>
                </div>
                <span className="checkout-summary-item-price">
                  {formatNaira(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary-divider" />

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatNaira(subtotal)}</span>
          </div>

          {submitError && (
            <div className="checkout-error-banner" role="alert">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order…' : 'Place Order'}
          </button>

          <Link to="/cart" className="btn btn-outline btn-block">
            Back to Cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
