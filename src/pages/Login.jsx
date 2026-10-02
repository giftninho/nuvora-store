import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="login-page">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Welcome to Nuvora Store</h1>
        <p className="page-subtitle">Sign in to manage your orders and speed up checkout.</p>
      </div>

      <div className="card-placeholder" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <span className="phase-tag">Phase 1: Foundation</span>
        <h2>Authentication Portal</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          Google OAuth authentication via Supabase Auth will be integrated in Phase 6.
        </p>
        <button className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem' }} disabled>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.31 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.2 0 10.05 0 12s.46 3.8 1.27 5.41l4.01-3.09z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"/>
          </svg>
          Continue with Google (Phase 6)
        </button>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          &larr; Return to Store
        </Link>
      </div>
    </div>
  );
}
