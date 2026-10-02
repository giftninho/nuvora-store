import React from 'react';
import { Link } from 'react-router-dom';
import { formatNaira } from '../utils/currency';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const lineSubtotal = product.price * quantity;

  return (
    <li className="cart-item">
      <Link to={`/products/${product.id}`} className="cart-item-image-link" tabIndex={-1} aria-hidden="true">
        <img src={product.image_url} alt={product.name} className="cart-item-image" />
      </Link>

      <div className="cart-item-info">
        <h3 className="cart-item-name">
          <Link to={`/products/${product.id}`} className="product-title-link">{product.name}</Link>
        </h3>
        <p className="cart-item-unit-price">{formatNaira(product.price)} each</p>
        <button
          type="button"
          className="link-button"
          onClick={() => removeFromCart(product.id)}
          aria-label={`Remove ${product.name} from cart`}
        >
          Remove
        </button>
      </div>

      <div className="quantity-control" role="group" aria-label={`Quantity for ${product.name}`}>
        <button
          type="button"
          className="quantity-btn"
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label={`Decrease quantity of ${product.name}`}
        >
          &minus;
        </button>
        <span className="quantity-value" aria-live="polite">{quantity}</span>
        <button
          type="button"
          className="quantity-btn"
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label={`Increase quantity of ${product.name}`}
        >
          +
        </button>
      </div>

      <p className="cart-item-subtotal" aria-label={`Subtotal for ${product.name}`}>
        {formatNaira(lineSubtotal)}
      </p>
    </li>
  );
}
