import React, { useCallback, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getProducts } from '../services/products';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('We could not load the products right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Explore Our Collection</h1>
        <p className="page-subtitle">Carefully curated essentials designed for everyday living.</p>
      </div>

      {loading && <Loading message="Loading products..." />}

      {!loading && error && (
        <ErrorMessage title="Could not load products" message={error} onRetry={loadProducts} />
      )}

      {!loading && !error && products.length === 0 && (
        <p className="empty-text">No products are available yet. Please check back soon.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="product-grid" aria-label="Products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
}
