import React from 'react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Provide your delivery details and finalize your order.</p>
      </div>

      <div className="card-placeholder">
        <span className="phase-tag">Phase 1: Foundation</span>
        <h2>Checkout System Skeleton</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          Customer details form (name, email, delivery address), validation, and Supabase order persistence will be connected in Phase 5.
        </p>
        <Link to="/order-success" className="btn btn-outline">
          Preview Order Success Page
        </Link>
      </div>
    </div>
  );
}
