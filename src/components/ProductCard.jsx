import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatNaira } from '../utils/currency';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <article className="product-card" id={`product-card-${product.id}`}>
      <Link to={`/products/${product.id}`} className="product-card-image-link" tabIndex={-1} aria-hidden="true">
        <div className="product-image-container">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="product-card-body">
        <h3 className="product-title">
          <Link to={`/products/${product.id}`} className="product-title-link">
            {product.name}
          </Link>
        </h3>

        <p className="product-description">{product.description}</p>

        <div className="product-price-row">
          <span className="product-price">{formatNaira(product.price)}</span>
        </div>

        <div className="product-card-actions">
          <button
            type="button"
            className={`btn ${justAdded ? 'btn-success' : 'btn-primary'} btn-add-cart`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <Link
            to={`/products/${product.id}`}
            className="btn btn-outline btn-view-details"
            aria-label={`View details for ${product.name}`}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
