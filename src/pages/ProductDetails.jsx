import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/products';
import { SupabaseConfigurationError } from '../lib/supabase';
import { formatNaira } from '../utils/currency';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError('');
    setQuantity(1);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(
        err instanceof SupabaseConfigurationError
          ? err.message
          : 'We could not load this product right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (loading) {
    return <Loading message="Loading product..." />;
  }

  if (error) {
    return <ErrorMessage title="Could not load product" message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="card-placeholder">
          <h1 className="page-title">Product not found</h1>
          <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
            We could not find a product with that link. It may have been removed.
          </p>
          <Link to="/" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Link to="/" className="back-link">&larr; Back to Shop</Link>

      <article className="product-details">
        <div className="product-details-image">
          <img src={product.image_url} alt={product.name} />
        </div>

        <div className="product-details-info">
          <h1 className="page-title">{product.name}</h1>
          <p className="product-details-price">{formatNaira(product.price)}</p>
          <p className="product-details-description">{product.description}</p>

          <div className="quantity-row">
            <label htmlFor="quantity-value" className="quantity-label">Quantity</label>
            <div className="quantity-control">
              <button
                type="button"
                className="quantity-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <output id="quantity-value" className="quantity-value" aria-live="polite">{quantity}</output>
              <button
                type="button"
                className="quantity-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="product-details-actions">
            <button
              type="button"
              className={`btn ${justAdded ? 'btn-success' : 'btn-primary'}`}
              onClick={handleAddToCart}
            >
              {justAdded ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="btn btn-outline">View Cart</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
